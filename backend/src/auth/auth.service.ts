/**
 * Servicio de autenticación que maneja todas las operaciones relacionadas con usuarios e iglesias.
 * Incluye registro, login, actualización de perfil, cambio de contraseña y eliminación de cuenta.
 * Utiliza Prisma para la base de datos y bcrypt para hashing de contraseñas.
 */
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

/**
 * DTO para registro de usuario normal
 */
export interface RegisterUserDto {
  email: string;
  name: string;
  password: string;
}

/**
 * DTO para registro de iglesia
 */
export interface RegisterChurchDto {
  email: string;
  name: string;
  password: string;
  denomination: string;
}

/**
 * DTO para login
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * DTO para validación de usuario OAuth (Google, Facebook, X)
 */
export interface OAuthUserDto {
  oauthId: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: 'google' | 'facebook' | 'x';
  phone?: string;
}

/**
 * DTO para validación de usuario Google OAuth
 * @deprecated Usar OAuthUserDto
 */
export interface GoogleUserDto {
  googleId: string;
  email: string;
  name: string;
  photoUrl?: string;
  provider: 'google';
  phone?: string;
}

@Injectable()
export class AuthService {
  /**
   * Constructor que inyecta las dependencias necesarias
   * @param prisma Servicio de Prisma para acceso a BD
   * @param jwtService Servicio de JWT para generación de tokens
   */
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario normal en el sistema.
   * Verifica que el email no esté registrado, hashea la contraseña y crea el usuario.
   * @param dto Datos del usuario a registrar
   * @returns Token de acceso y datos del usuario
   */
  async registerUser(dto: RegisterUserDto) {
    // Verificar si el email ya existe
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email ya registrado');

    // Hashear la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear el usuario en la base de datos
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        type: 'USER',
      },
    });

    // Generar y retornar token de acceso
    return this.generateToken(user);
  }

  /**
   * Registra una nueva iglesia en el sistema.
   * Crea primero la iglesia y luego el usuario administrador asociado.
   * @param dto Datos de la iglesia y usuario administrador
   * @returns Token de acceso y datos del usuario
   */
  async registerChurch(dto: RegisterChurchDto) {
    // Verificar si el email ya existe
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (exists) throw new ConflictException('Email ya registrado');

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Crear la iglesia primero
    const church = await this.prisma.iglesia.create({
      data: {
        name: dto.name,
        denomination: dto.denomination,
      },
    });

    // Crear el usuario administrador de la iglesia
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: dto.name,
        password: hashedPassword,
        type: 'IGLESIA',
        churchId: church.id,
      },
      include: { church: true },
    });

    // Generar token
    return this.generateToken(user);
  }

  /**
   * Autentica un usuario con email y contraseña.
   * Verifica las credenciales y retorna un token JWT si son válidas.
   * @param dto Credenciales de login
   * @returns Token de acceso y datos del usuario
   */
  async login(dto: LoginDto) {
    // Buscar el usuario por email
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) throw new UnauthorizedException('Credenciales Invalidas');

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid)
      throw new UnauthorizedException('Credenciales Invalidas');

    // Generar token
    return this.generateToken(user);
  }

  /**
   * Genera un token JWT y retorna la respuesta completa de autenticación.
   * @param user Usuario autenticado
   * @returns Objeto con token y datos del usuario
   */
  private generateToken(user: any) {
    // Crear payload del JWT con información esencial del usuario
    const payload = {
      sub: user.id,
      email: user.email,
      type: user.type,
      churchId: user.churchId,
    };

    return {
      access_token: this.jwtService.sign(payload), // Firmar el token
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        type: user.type,
        churchId: user.churchId,
      },
    };
  }

  /**
   * Actualiza el perfil del usuario autenticado.
   * @param dto Datos a actualizar (name, email, phone)
   * @param user Usuario actual de la sesión
   * @returns Usuario actualizado
   */
  async updateProfile(dto: any, user: any) {
    return this.prisma.user.update({
      where: { id: user.id },
      data: {
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      },
    });
  }

  /**
   * Cambia la contraseña del usuario autenticado.
   * Verifica la contraseña actual antes de actualizar.
   * @param dto Datos del cambio (currentPassword, newPassword)
   * @param user Usuario actual
   */
  async changePassword(dto: any, user: any) {
    // Obtener el usuario actual
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) throw new UnauthorizedException('Usuario no encontrado');

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      currentUser.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña actual incorrecta');

    // Hashear la nueva contraseña si se proporciona
    const hashedNewPassword = dto.newPassword
      ? await bcrypt.hash(dto.newPassword, 10)
      : currentUser.password;

    // Actualizar la contraseña
    await this.prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword },
    });
  }

  /**
   * Elimina la cuenta del usuario autenticado.
   * Para iglesias, elimina también todos los campamentos asociados.
   * Elimina todas las inscripciones antes de eliminar el usuario.
   * @param password Contraseña para confirmar la eliminación
   * @param user Usuario actual
   */
  async deleteAccount(password: string, user: any) {
    // Verificar el usuario existe
    const currentUser = await this.prisma.user.findUnique({
      where: { id: user.id },
    });

    if (!currentUser) throw new UnauthorizedException('Usuario no encontrado');

    // Si es usuario OAuth, verificar que sea eliminación sin contraseña
    if (currentUser.provider === 'google') {
      // Para usuarios OAuth, eliminamos directamente
      await this._deleteUserData(currentUser, user);
      return { message: 'Cuenta eliminada exitosamente' };
    }

    // Verificar la contraseña para usuarios tradicionales
    const isPasswordValid = await bcrypt.compare(
      password,
      currentUser.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    await this._deleteUserData(currentUser, user);
    return { message: 'Cuenta eliminada exitosamente' };
  }

/**
    * Valida o crea un usuario autenticado vía OAuth (Google, Facebook, X).
    * Maneja usuarios nuevos y existentes, actualizando información si es necesario.
    * @param oauthUser Datos del usuario OAuth
    * @returns Token JWT y datos del usuario
    */
  async validateOAuthUser(oauthUser: OAuthUserDto) {
    const { oauthId, email, name, phone, provider } = oauthUser;

    // Buscar si existe un usuario con ese email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: { church: true },
    });

    if (existingUser) {
      // Determinar el campo de ID según el proveedor
      const idField = provider === 'google' ? 'googleId' 
        : provider === 'facebook' ? 'facebookId' 
        : 'xId';
      const existingId = existingUser[idField as keyof typeof existingUser];

      // Si el usuario ya tiene LinkedIn de otro proveedor, actualizar
      if (existingId === oauthId) {
        if (existingUser.name !== name) {
          await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { name },
          });
        }
        return this.generateToken(existingUser);
      }

      // Si ya tiene otro proveedor vinculado, agregar este
      if (!existingId && existingUser.provider !== 'email') {
        const updateData: any = {
          name,
          provider: 'multiple',
          isOAuthUser: true,
        };
        updateData[idField] = oauthId;

        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: updateData,
        });

        return this.generateToken(existingUser);
      }
    }

    // Crear nuevo usuario OAuth
    const createData: any = {
      email,
      name,
      provider,
      type: 'USER',
      password: '',
      isOAuthUser: true,
    };
    createData[provider === 'google' ? 'googleId' 
      : provider === 'facebook' ? 'facebookId' 
      : 'xId'] = oauthId;

    const newUser = await this.prisma.user.create({
      data: createData,
      include: { church: true },
    });

    return this.generateToken(newUser);
  }

  /**
    * Valida o crea un usuario autenticado vía Google OAuth.
    * @deprecated Usar validateOAuthUser en su lugar
    */
  async validateGoogleUser(googleUser: GoogleUserDto) {
    const { googleId, email, name, phone } = googleUser;

    // Buscar si existe un usuario con ese email
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
      include: { church: true },
    });

    if (existingUser) {
      // Si el usuario existe pero no es de Google, verificar si quiere vincular cuentas
      if (existingUser.provider === 'email' && !existingUser.googleId) {
        // Opción 1: Vincular cuenta Google existente
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId,
            provider: 'both',
            isOAuthUser: true,
          },
        });

        return this.generateToken(existingUser);
      }

      // Si el usuario ya está vinculado con Google, actualizar datos si es necesario
      if (existingUser.googleId === googleId) {
        // Actualizar nombre si ha cambiado en Google
        if (existingUser.name !== name) {
          await this.prisma.user.update({
            where: { id: existingUser.id },
            data: { name },
          });
        }
        
        return this.generateToken(existingUser);
      }

      // Si existe con email pero con googleId diferente, error de seguridad
      if (existingUser.googleId && existingUser.googleId !== googleId) {
        throw new ConflictException('Email ya registrado con otra cuenta de Google');
      }
    }

    // Crear nuevo usuario de Google OAuth
    const newUser = await this.prisma.user.create({
      data: {
        email,
        name,
        googleId,
        provider: 'google',
        type: 'USER',
        password: '', // Sin contraseña para usuarios OAuth
        isOAuthUser: true,
      },
      include: { church: true },
    });

    return this.generateToken(newUser);
  }

  /**
   * Vincula una cuenta de Google a un usuario existente.
   * @param userId ID del usuario existente
   * @param googleId ID de Google a vincular
   * @returns Usuario actualizado
   */
  async linkGoogleAccount(userId: number, googleId: string) {
    // Verificar que el usuario exista
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    // Verificar que el googleId no esté ya en uso por otro usuario
    const existingGoogleUser = await this.prisma.user.findFirst({
      where: { googleId },
    });

    if (existingGoogleUser && existingGoogleUser.id !== userId) {
      throw new ConflictException('Cuenta de Google ya está vinculada a otro usuario');
    }

    // Actualizar usuario con Google ID
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        googleId,
        provider: user.provider === 'email' ? 'both' : 'google',
        isOAuthUser: true,
      },
      include: { church: true },
    });

    return updatedUser;
  }

/**
    * Método auxiliar para eliminar datos de usuario (iglesias, campamentos, inscripciones)
    * @param user Usuario a eliminar
    * @param currentUser Usuario de la sesión
    */
  private async _deleteUserData(user: any, currentUser: any) {
    // Si es una iglesia, eliminar campamentos primero
    if (user.type === 'IGLESIA' && user.churchId) {
      // Eliminar todos los campamentos asociados a la iglesia
      await this.prisma.campamento.deleteMany({
        where: { churchId: user.churchId },
      });

      // Eliminar la iglesia
      await this.prisma.iglesia.delete({
        where: { id: user.churchId },
      });
    }

    // Eliminar todas las inscripciones del usuario
    await this.prisma.registration.deleteMany({
      where: { userId: currentUser.id },
    });

    // Finalmente eliminar el usuario
    await this.prisma.user.delete({ where: { id: currentUser.id } });
  }

  /**
   * Verifica un usuario como iglesia.
   * Crea la iglesia y actualiza el tipo de usuario.
   * @param denomination Denominación de la iglesia
   * @param user Usuario a verificar
   */
  async verifyChurchAsUser(denomination: string, user: any) {
    // Crear la iglesia
    const church = await this.prisma.iglesia.create({
      data: {
        name: user.name,
        denomination,
      },
    });

    // Actualizar el usuario a tipo IGLESIA
    const updatedUser = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        type: 'IGLESIA',
        churchId: church.id,
      },
      include: { church: true },
    });

    return { user: updatedUser, church };
  }
}
