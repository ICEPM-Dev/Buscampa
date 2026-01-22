/**
 * Guard de autenticación JWT que protege rutas requeridas.
 * Extiende AuthGuard de Passport para validar tokens JWT en las solicitudes.
 */
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
