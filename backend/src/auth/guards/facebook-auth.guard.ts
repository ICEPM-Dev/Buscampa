import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class FacebookAuthGuard extends AuthGuard('facebook') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Si el usuario canceló, dejar pasar sin autenticar
    if (request.query.error === 'access_denied' || 
        request.query.error_reason === 'user_denied') {
      return true;
    }

    return super.canActivate(context) as Promise<boolean>;
  }
}