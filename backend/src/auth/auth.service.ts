import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface RegisterUserDto {
  email: string;
  name: string;
  password: string;
}

export interface RegisterChurchDto {
  email: string;
  name: string;
  password: string;
  denomination: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        type: 'USER',
      },
    });

    return this.generateToken(user);
  }

  async registerChurch(dto: RegisterChurchDto) {
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const church = await this.prisma.iglesia.create({
      data: {
        name: dto.name,
        denomination: dto.denomination,
      },
    });

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        type: 'IGLESIA',
        churchId: church.id,
      },
      include: { church: true },
    });

    return this.generateToken(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales Invalidas');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales Invalidas');

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, type: user.type, churchId: user.churchId };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        churchId: user.churchId,
      },
    };
  }

  async updateProfile(dto: any, user: any) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  async changePassword(dto: any, user: any) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, currentUser.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña actual incorrecta');

    const hashedNewPassword = dto.newPassword 
      ? await bcrypt.hash(dto.newPassword, 10)
      : currentUser.password;

    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
  }

  async deleteAccount(password: string, user: any) {
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) throw new UnauthorizedException('Usuario no encontrado');

    const isPasswordValid = await bcrypt.compare(password, currentUser.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    // Si es una iglesia, necesitamos eliminar campamentos primero
    if (currentUser.type === 'IGLESIA' && currentUser.churchId) {
      // Eliminar todos los campamentos asociados
      await this.prisma.campamento.deleteMany({
        where: { churchId: currentUser.churchId },
      });

      // Eliminar la iglesia
      await this.prisma.iglesia.delete({
        where: { id: currentUser.churchId },
      });
    }

    // Eliminar todas las inscripciones del usuario
    await this.prisma.registration.deleteMany({
      where: { userId: user.id },
    });

    // Finalmente eliminar el usuario
    await this.prisma.user.delete({ where: { id: user.id } });
  }
}
