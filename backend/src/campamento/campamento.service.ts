/**
 * Servicio para la gestión de campamentos.
 * Maneja operaciones CRUD con validaciones de permisos por iglesia.
 */
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampamentoDto } from './dto/create-campamento.dto.ts';
import { UpdateCampamentoDto } from './dto/update-campamento.dto';

@Injectable()
export class CampamentoService {
  /**
   * Constructor que inyecta el servicio de Prisma
   */
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo campamento asociado a la iglesia del usuario.
   * Determina la iglesia basándose en el tipo de usuario.
   * @param dto Datos del campamento a crear
   * @param userId ID del usuario que crea el campamento
   * @returns Campamento creado
   */
  async create(dto: CreateCampamentoDto, userId: number) {
    let churchId: number;

    // Buscar el usuario y su iglesia
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { church: true },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Determinar el ID de la iglesia
    if (user.churchId) {
      churchId = user.churchId; // Usuario pertenece a iglesia
    } else {
      // Buscar iglesia donde el usuario es admin
      const church = await this.prisma.iglesia.findUnique({
        where: { userId },
      });

      if (!church) throw new NotFoundException('Iglesia no encontrada');

      churchId = church.id;
    }

    // Crear el campamento
    return this.prisma.campamento.create({
      data: {
        ...dto,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        churchId,
      },
    });
  }

  /**
   * Obtiene todos los campamentos públicos (sin filtro por iglesia).
   * @returns Lista de todos los campamentos con información de iglesia
   */
  async findAllPublic() {
    return this.prisma.campamento.findMany({
      include: { church: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtiene todos los campamentos, opcionalmente filtrados por iglesia.
   * @param churchId ID de la iglesia para filtrar (opcional)
   * @returns Lista de campamentos con información de iglesia
   */
  async findAll(churchId?: number) {
    const where = churchId ? { churchId } : {};

    return this.prisma.campamento.findMany({
      where,
      include: { church: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Obtiene un campamento específico por ID.
   * @param id ID del campamento
   * @returns Campamento con información de iglesia
   */
  async findOne(id: number) {
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
      include: { church: true },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    return campamento;
  }

  /**
   * Actualiza un campamento existente.
   * Verifica que el usuario tenga permisos sobre el campamento (misma iglesia).
   * @param id ID del campamento
   * @param dto Datos a actualizar
   * @param userId ID del usuario que realiza la actualización
   * @returns Campamento actualizado
   */
  async update(id: number, dto: UpdateCampamentoDto, userId: number) {
    // Verificar que el campamento existe
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Verificar permisos (misma iglesia)
    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para editar este campamento',
      );

    // Preparar datos de actualización
    const updateData: any = { ...dto };

    if (dto.startDate) updateData.startDate = new Date(dto.startDate);
    if (dto.endDate) updateData.endDate = new Date(dto.endDate);

    // Actualizar el campamento
    return this.prisma.campamento.update({
      where: { id },
      data: updateData,
    });
  }

  /**
   * Elimina un campamento.
   * Verifica que el usuario tenga permisos sobre el campamento.
   * @param id ID del campamento a eliminar
   * @param userId ID del usuario que realiza la eliminación
   * @returns Campamento eliminado
   */
  async remove(id: number, userId: number) {
    // Verificar que el campamento existe
    const campamento = await this.prisma.campamento.findUnique({
      where: { id },
    });

    if (!campamento) throw new NotFoundException('Campamento no encontrado');

    // Verificar que el usuario existe
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    // Verificar permisos
    if (campamento.churchId !== user.churchId)
      throw new NotFoundException(
        'No tienes permiso para eliminar este campamento',
      );

    // Eliminar el campamento
    return this.prisma.campamento.delete({ where: { id } });
  }
}
