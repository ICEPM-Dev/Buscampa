/**
 * Decorador personalizado para extraer el usuario de la solicitud HTTP.
 * Se usa en controladores protegidos para obtener el usuario autenticado del request.
 */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user; // Usuario establecido por la estrategia JWT
  },
);
