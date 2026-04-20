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
  /**
   * Constructor que configura la estrategia de Google OAuth
   * @param authService Servicio de autenticación para manejar usuarios
   * @param configService Servicio de configuración para variables de entorno
   */
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get('BACKEND_URL')}/auth/google/callback`,
      scope: ['email', 'profile', 'https://www.googleapis.com/auth/user.phonenumbers.read'],
      passReqToCallback: false,
    } as any);
  }

  /**
   * Valida el usuario de Google y lo integra con el sistema existente
   * @param accessToken Token de acceso de Google
   * @param refreshToken Token de refresco de Google
   * @param profile Perfil del usuario de Google
   * @returns Usuario validado con token del sistema
   */
  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    const { id, emails, name, photos } = profile;
    
    // Extraer información del perfil de Google
    const email = emails?.[0]?.value;
    const fullName = name?.givenName && name?.familyName 
      ? `${name.givenName} ${name.familyName}` 
      : name?.givenName || email?.split('@')[0] || 'Usuario';
    const photoUrl = photos?.[0]?.value;

    if (!email) {
      throw new Error('No se pudo obtener el email del perfil de Google');
    }

    let phoneNumber: string | undefined;
    try {
      const response = await fetch('https://people.googleapis.com/v1/people/me?personFields=phoneNumbers', {
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });

      const data = await response.json();
      phoneNumber = data.phoneNumbers?.[0]?.value;
    } catch (error) {
      console.warn('No se pudo obtener teléfono de Google')
    }

    // Validar o crear usuario a través del servicio de autenticación
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