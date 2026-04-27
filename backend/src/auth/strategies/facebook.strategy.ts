/**
 * Estrategia Facebook OAuth para Passport.
 * Maneja la autenticación con Facebook OAuth 2.0.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('FACEBOOK_CLIENT_ID'),
      clientSecret: configService.get('FACEBOOK_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/api/auth/facebook/callback`,
      scope: ['public_profile'],
      profileFields: ['id', 'displayName', 'emails', 'photos'],
      passReqToCallback: false,
    } as any);
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    const { id, displayName, emails, photos } = profile;

    const email = emails?.[0]?.value || `${id}@facebook.com`;
    const name = displayName || email?.split('@')[0] || 'Usuario';
    const photoUrl = photos?.[0]?.value;

    if (!email) {
      throw new Error('No se pudo obtener el email de Facebook');
    }

    const user = await this.authService.validateOAuthUser({
      oauthId: id,
      email: email,
      name: name,
      photoUrl: photoUrl,
      provider: 'facebook',
    });

    return user;
  }
}
