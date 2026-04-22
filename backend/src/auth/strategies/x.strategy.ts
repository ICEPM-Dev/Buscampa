/**
 * Estrategia X (Twitter) OAuth para Passport.
 * Maneja la autenticación con X (Twitter) OAuth 2.0.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class XStrategy extends PassportStrategy(Strategy, 'x') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      authorizationURL: 'https://twitter.com/i/oauth2/authorize',
      tokenURL: 'https://api.twitter.com/2/oauth2/token',
      clientID: configService.get('X_CLIENT_ID'),
      clientSecret: configService.get('X_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/api/auth/x/callback`,
      scope: ['tweet.read', 'users.read', 'offline.access'],
      state: false,
      pkce: false,
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Obtener perfil de X manualmente con el accessToken
    const response = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url,name,username', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();
    const xUser = data.data;

    const user = await this.authService.validateOAuthUser({
      oauthId: xUser.id,
      email: `${xUser.username}@x.com`,
      name: xUser.name || xUser.username,
      photoUrl: xUser.profile_image_url,
      provider: 'x',
    });
    return user;
  }
}
