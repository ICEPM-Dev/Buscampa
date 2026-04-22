/**
 * Estrategia JWT para Passport.
 * Extrae y valida tokens JWT del header Authorization.
 * Retorna el usuario completo si el token es válido.
 */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  /**
   * Constructor que configura la estrategia JWT
   */
  constructor(private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraer del header Bearer
      ignoreExpiration: false, // No ignorar expiración
      secretOrKey: process.env.JWT_SECRET || 'tu-secret-aqui', // Clave secreta
    });
  }

  /**
   * Valida el payload del JWT y retorna el usuario
   * @param payload Payload decodificado del token
   * @returns Usuario completo con iglesia incluida
   */
  async validate(payload: any) {
    // Buscar el usuario por ID del payload
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: { church: true },
    });

    if (!user) throw new UnauthorizedException();

    // Retornar usuario con photoUrl
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      phone: user.phone,
      churchId: user.churchId,
      photoUrl: user.photoUrl,
      church: user.church,
    };
  }
}

