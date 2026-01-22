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
} from '@nestjs/common';
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
}
