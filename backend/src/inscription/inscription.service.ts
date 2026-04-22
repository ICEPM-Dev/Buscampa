/**
 * Servicio para la gestión de inscripciones a campamentos.
 * Maneja la creación de inscripciones y consultas por usuario/campamento.
 */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInscriptionDto } from './dto/create-inscription.dto';

@Injectable()
export class InscriptionService {
  /**
   * Constructor que inyecta el servicio de Prisma
   */
  constructor(private prisma: PrismaService) {}
  /**
   * Crea una nueva inscripción para un campamento.
   * Verifica que el campamento existe y que el usuario no esté ya inscripto.
   * @param dto Datos de la inscripción
   * @param userId ID del usuario que se inscribe
   * @param campamentoId ID del campamento
   * @returns Inscripción creada con datos relacionados
   */
  async create(
    dto: CreateInscriptionDto,
    userId: number,
    campamentoId: number,
  ) {
    // Verificar que el campamento existe
    const campamento = await this.prisma.campamento.findUnique({
      where: { id: campamentoId },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    // Verificar que no esté ya inscripto
    const existing = await this.prisma.registration.findFirst({
      where: {
        userId,
        campamentoId,
      },
    });

    if (existing)
      throw new ConflictException('Ya estás inscripto en este campamento');

    // Crear la inscripción
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

  /**
   * Obtiene todas las inscripciones de un campamento específico.
   * @param campamentoId ID del campamento
   * @returns Lista de inscripciones con datos de usuario y campamento
   */
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

  /**
   * Obtiene todas las inscripciones de un usuario específico.
   * @param userId ID del usuario
   * @returns Lista de inscripciones con datos de campamento e iglesia
   */
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

  /**
   * Obtiene una inscripción específica por ID.
   * @param id ID de la inscripción
   * @param userId ID del usuario (para futuras validaciones)
   * @returns Inscripción con datos relacionados
   */
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

  /**
   * Cancela una inscripción.
   * @param id ID de la inscripción
   * @param userId ID del usuario que cancela
   * @returns Inscripción cancelada
   */
  async cancel(id: number, userId: number) {
    const inscription = await this.prisma.registration.findUnique({
      where: { id },
    });

    if (!inscription) throw new NotFoundException('Inscripción no encontrada');
    if (inscription.userId !== userId) {
      throw new ConflictException('No puedes cancelar esta inscripción');
    }

    return this.prisma.registration.delete({
      where: { id },
    });
  }
}
