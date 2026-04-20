/**
 * Estrategia X (Twitter) OAuth para Passport.
 * Maneja la autenticación con X (Twitter) OAuth 2.0.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from '@superfaceai/passport-twitter-oauth2';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XStrategy extends PassportStrategy(Strategy, 'x') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('X_CLIENT_ID'),
      clientSecret: configService.get('X_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/api/auth/x/callback`,
      clientType: 'confidential',
    });
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
