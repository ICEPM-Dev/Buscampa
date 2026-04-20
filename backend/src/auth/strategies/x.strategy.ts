/**
 * Estrategia X (Twitter) OAuth para Passport.
 * Maneja la autenticación con X (Twitter) OAuth 2.0.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-twitter';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XStrategy extends PassportStrategy(Strategy, 'x') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      consumerKey: configService.get('X_CLIENT_ID'),
      consumerSecret: configService.get('X_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/auth/x/callback`,
      passReqToCallback: false,
    } as any);
  }

  async validate(token: string, tokenSecret: string, profile: any) {
    const { id, displayName, photos } = profile;

    const email = `${displayName || id}@x.com`;
    const name = displayName || 'Usuario';
    const photoUrl = photos?.[0]?.value;

    if (!id) {
      throw new Error('No se pudo obtener el ID de X');
    }

    const user = await this.authService.validateOAuthUser({
      oauthId: id,
      email: email,
      name: name,
      photoUrl: photoUrl,
      provider: 'x',
    });

    return user;
  }
}