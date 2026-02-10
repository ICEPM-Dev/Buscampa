/**
 * Controlador para las rutas de autenticación y gestión de usuarios.
 * Proporciona endpoints para registro, login, perfil y eliminación de cuentas.
 */
import {
  Controller,
  Post,
  Body,
  Get,
  Put,
  Delete,
  UseGuards,
  Req,
  Res,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/auth.guard';
import { GetUser } from './decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterChurchDto } from './dto/register-church.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Controller('auth')
export class AuthController {
  /**
   * Constructor que inyecta el servicio de autenticación
   */
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para registrar un usuario normal
   * POST /auth/register
   */
  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  /**
   * Endpoint para registrar una iglesia
   * POST /auth/register/church
   */
  @Post('register/church')
  async registerChurch(@Body() dto: RegisterChurchDto) {
    return this.authService.registerChurch(dto);
  }

  /**
   * Endpoint para login de usuarios
   * POST /auth/login
   */
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  /**
   * Endpoint para obtener información del usuario autenticado
   * GET /auth/me
   * Requiere autenticación JWT
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }

  /**
   * Endpoint para actualizar el perfil del usuario
   * PUT /auth/me
   * Requiere autenticación JWT
   */
  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Body() dto: any, @GetUser() user: any) {
    return this.authService.updateProfile(dto, user);
  }

  /**
   * Endpoint para cambiar la contraseña
   * PUT /auth/password
   * Requiere autenticación JWT
   */
  @UseGuards(JwtAuthGuard)
  @Put('password')
  changePassword(@Body() dto: any, @GetUser() user: any) {
    return this.authService.changePassword(dto, user);
  }

  /**
   * Endpoint para eliminar la cuenta del usuario
   * PUT /auth/delete-account
   * Requiere autenticación JWT
   */
  @UseGuards(JwtAuthGuard)
  @Put('delete-account')
  deleteAccount(@Body() body: { password: string }, @GetUser() user: any) {
    return this.authService.deleteAccount(body.password, user);
  }

  /**
   * Endpoint para iniciar autenticación con Google OAuth
   * GET /auth/google
   * Redirige al usuario a Google para autenticación
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Passport se encarga de la redirección a Google
    // Este método se ejecuta después de la autenticación exitosa
  }

  /**
   * Endpoint de callback para Google OAuth
   * GET /auth/google/callback
   * Recibe la respuesta de Google y procesa la autenticación
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    try {
      // El usuario viene adjuntado al request por Passport
      const user = req.user as any;
      
      if (!user || !user.access_token) {
        throw new UnauthorizedException('Error en autenticación Google');
      }

      // Construir URL de redirección al frontend con el token
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/auth/google/callback?token=${user.access_token}`;
      
      // Redirigir al frontend con el token JWT
      return res.redirect(redirectUrl);
    } catch (error) {
      // En caso de error, redirigir al frontend con mensaje de error
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const errorUrl = `${frontendUrl}/login?error=google_auth_failed`;
      return res.redirect(errorUrl);
    }
  }

  /**
   * Endpoint para vincular cuenta existente con Google OAuth
   * GET /auth/google/link
   * Requiere autenticación JWT previa
   */
  @Get('google/link')
  @UseGuards(JwtAuthGuard)
  @UseGuards(AuthGuard('google'))
  async linkGoogleAccount(@Req() req: Request, @Res() res: Response) {
    try {
      const user = req.user as any;
      const currentUser = (req as any).user_from_jwt; // Usuario del JWT
      
      if (!user || !user.id) {
        throw new UnauthorizedException('Error en vinculación de cuenta Google');
      }

      // Vincular la cuenta de Google al usuario existente
      await this.authService.linkGoogleAccount(currentUser.id, user.id);
      
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const redirectUrl = `${frontendUrl}/profile?linked=google_success`;
      
      return res.redirect(redirectUrl);
    } catch (error) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const errorUrl = `${frontendUrl}/profile?error=google_link_failed`;
      return res.redirect(errorUrl);
    }
  }
}
