/**
 * Estrategia Google OAuth para Passport.
 * Maneja la autenticación con Google OAuth 2.0 y la integración con el sistema existente.
 */
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { AuthService } from '../auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/api/auth/google/callback`,
      scope: [
        'email',
        'profile',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
      ],
      passReqToCallback: false,
    } as any);
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, emails, name, photos } = profile;

    const email = emails?.[0]?.value;
    const fullName =
      name?.givenName && name?.familyName
        ? `${name.givenName} ${name.familyName}`
        : name?.givenName || email?.split('@')[0] || 'Usuario';
    const photoUrl = photos?.[0]?.value;

    if (!email) {
      throw new Error('No se pudo obtener el email del perfil de Google');
    }

    let phoneNumber: string | undefined;
    try {
      const response = await fetch(
        'https://people.googleapis.com/v1/people/me?personFields=phoneNumbers',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      const data = await response.json();

      if (data.phoneNumbers && data.phoneNumbers.length > 0) {
        phoneNumber = data.phoneNumbers[0].value;
      }
    } catch (error) {}

    const user = await this.authService.validateOAuthUser({
      oauthId: id,
      email: email,
      name: fullName,
      photoUrl: photoUrl,
      phone: phoneNumber,
      provider: 'google',
    });

    return user;
  }
}
