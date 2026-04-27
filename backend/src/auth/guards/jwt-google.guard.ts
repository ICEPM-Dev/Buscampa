/**
 * Guard combinado para autenticación JWT y Google OAuth.
 * Permite endpoints que requieren tanto autenticación JWT como validación Google.
 * Utilizado principalmente para vincular cuentas existentes con Google OAuth.
 */
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtGoogleAuthGuard extends AuthGuard(['jwt', 'google']) {
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * Maneja la activación del guard basado en el contexto.
   * @param context Contexto de ejecución de la petición
   * @returns boolean indicando si el guard debe activarse
   */
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  /**
   * Maneja la lógica de autenticación combinada.
   * Primero valida JWT, luego Google OAuth si es necesario.
   * @param err Error de autenticación
   * @param user Usuario autenticado
   * @param info Información adicional de autenticación
   * @returns Boolean indicando éxito de autenticación
   */
  handleRequest(err, user, info) {
    if (err || !user) {
      throw (
        err || new Error('No autorizado - Autenticación combinada requerida')
      );
    }
    return user;
  }
}
