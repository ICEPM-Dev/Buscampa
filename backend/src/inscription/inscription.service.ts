import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

@Injectable()
export class InscriptionService {
  constructor(private prisma: PrismaService) {}
  async create(
    dto: CreateInscriptionDto,
    userId: number,
    campamentoId: number,
  ) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id: campamentoId },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    const existing = await this.prisma.registration.findFirst({
      where: {
        userId,
        campamentoId,
      },
    });

    if (existing)
      throw new ConflictException('Ya estás inscripto en este campamento');

    return this.prisma.registration.create({
      data: {
        ...dto,
        userId,
        campamentoId,
      },
      include: {
        campamento: true,
        user: true,
      },
    });
  }

  async findByCampamento(campamentoId: number) {
    return this.prisma.registration.findMany({
      where: { campamentoId },
      include: {
        user: true,
        campamento: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.registration.findMany({
      where: { userId },
      include: {
        campamento: {
          include: { church: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const inscription = await this.prisma.registration.findUnique({
      where: { id },
      include: {
        campamento: true,
        user: true,
      },
    });

    if (!inscription) throw new NotFoundException('Inscripción no encontrada');

    return inscription;
  }
}
