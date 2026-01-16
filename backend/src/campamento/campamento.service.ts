import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';

@Injectable()
export class CampamentoService {
  constructor(private prisma: PrismaService) {}

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

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para editar este campamento',
      );

    const updateData: any = { ...dto };

    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    return this.prisma.campamento.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number, userId: number) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para eliminar este campamento',
      );

    return this.prisma.campamento.delete({ where: { id } });
  }
}
