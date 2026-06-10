/**
 * Servicio para la gestión de campamentos.
 * Maneja operaciones CRUD con validaciones de permisos por iglesia.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class CampamentoService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async create(dto: CreateCampamentoDto, userId: number) {
    let churchId: number;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { church: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.churchId) {
      churchId = user.churchId;
    } else {
      const church = await this.prisma.iglesia.findUnique({
        where: { userId },
      });
      if (!church) throw new NotFoundException('Iglesia no encontrada');
      churchId = church.id;
    }

    return this.prisma.campamento.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        churchId,
      },
    });
  }

  async findAllPublic() {
    return this.prisma.campamento.findMany({
      include: { church: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(churchId?: number) {
    const where = churchId ? { churchId } : {};
    return this.prisma.campamento.findMany({
      where,
      include: { church: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
      include: { church: true },
    });
    if (!campamento) throw new NotFoundException('Campamento no encontrado');
    return campamento;
  }

  async update(id: number, dto: UpdateCampamentoDto, userId: number) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
    });
    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para editar este campamento',
      );

    const updateData: any = { ...dto };
    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    return this.prisma.campamento.update({ where: { id }, data: updateData });
  }

  async remove(id: number, userId: number) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
    });
    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para eliminar este campamento',
      );

    return this.prisma.campamento.delete({ where: { id } });
  }

  async deleteExpired(): Promise<number> {
    const now = new Date();

    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };

    const in7days = startOfDay(
      new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    );
    const in7daysEnd = new Date(in7days.getTime() + 24 * 60 * 60 * 1000);

    const in1day = startOfDay(
      new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
    );
    const in1dayEnd = new Date(in1day.getTime() + 24 * 60 * 60 * 1000);

    const proximos7 = await this.prisma.campamento.findMany({
      where: { startDate: { gte: in7days, lt: in7daysEnd } },
      include: { registrations: true },
    });

    for (const c of proximos7) {
      for (const r of c.registrations) {
        this.emailService.sendRecordatorio({
          to: r.email,
          userName: r.fullName,
          campamentoName: c.name,
          location: c.location,
          startDate: c.startDate,
          daysLeft: 7,
        });
      }
    }

    const proximos1 = await this.prisma.campamento.findMany({
      where: { startDate: { gte: in1day, lt: in1dayEnd } },
      include: { registrations: true },
    });

    for (const c of proximos1) {
      for (const r of c.registrations) {
        this.emailService.sendRecordatorio({
          to: r.email,
          userName: r.fullName,
          campamentoName: c.name,
          location: c.location,
          startDate: c.startDate,
          daysLeft: 1,
        });
      }
    }

    const vencidos = await this.prisma.campamento.findMany({
      where: { endDate: { lt: now } },
      include: { registrations: true },
    });

    for (const c of vencidos) {
      for (const r of c.registrations) {
        this.emailService.sendCampamentoFinalizado({
          to: r.email,
          userName: r.fullName,
          campamentoName: c.name,
        });
      }
    }

    const result = await this.prisma.campamento.deleteMany({
      where: { endDate: { lt: now } },
    });

    return result.count;
  }
}
