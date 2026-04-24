/**
 * Controlador para las rutas de autenticación OAuth.
 * Solo maneja login/registro con redes sociales (Google, Facebook, X).
 */
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/auth.guard';
import { GetUser } from './decorators/user.decorator';
import { AuthService } from './auth.service';
import { FacebookAuthGuard } from './guards/facebook-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Endpoint para obtener información del usuario autenticado
   * GET /auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
      phone: user.phone,
      churchId: user.churchId,
      photoUrl: user.photoUrl,
    };
  }

  /**
   * Endpoint para actualizar el perfil del usuario
   * PUT /auth/me
   */
  @UseGuards(JwtAuthGuard)
  @Put('me')
  async updateProfile(@Body() dto: any, @GetUser() user: any) {
    const updated = await this.authService.updateProfile(dto, user);
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      type: updated.type,
      phone: updated.phone,
      churchId: updated.churchId,
      photoUrl: updated.photoUrl,
    };
  }

  /**
   * Endpoint para cambiar la contraseña
   * PUT /auth/password
   */
  @UseGuards(JwtAuthGuard)
  @Put('password')
  changePassword(@Body() dto: any, @GetUser() user: any) {
    return this.authService.changePassword(dto, user);
  }

  /**
   * Endpoint para eliminar la cuenta del usuario
   * PUT /auth/delete-account
   */
  @UseGuards(JwtAuthGuard)
  @Put('delete-account')
  deleteAccount(@Body() body: any, @GetUser() user: any) {
    return this.authService.deleteAccount('', user);
  }

  /**
   * Endpoint para verificar cuenta como iglesia
   * POST /auth/verify-church
   */
  @UseGuards(JwtAuthGuard)
  @Post('verify-church')
  async verifyChurch(
    @Body() body: { denomination: string },
    @GetUser() user: any,
  ) {
    return this.authService.verifyChurchAsUser(body.denomination, user);
  }

  /**
   * Endpoint para iniciar autenticación con Google OAuth
   * GET /auth/google
   */
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  /**
   * Callback de Google OAuth
   * GET /auth/google/callback
   */
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthCallback(@Req() req: Request, @Res() res: Response) {
    const error = req.query.error as string;
    const errorReason = req.query.error_reason as string;

    if (error === 'access_denied' || errorReason === 'user_denied') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth?error=google_denied`);
    }

    const user = req.user as any;

    if (!user || !user.access_token) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth?error=google_auth_failed`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/google/callback?token=${user.access_token}`;

    return res.redirect(redirectUrl);
  }

  /**
   * Endpoint para iniciar autenticación con Facebook OAuth
   * GET /auth/facebook
   */
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  /**
   * Callback de Facebook OAuth
   * GET /auth/facebook/callback
   * Handle both success and cancellation
   */
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookAuthCallback(@Req() req: Request, @Res() res: Response) {
    // Check for cancellation first (even after guard runs)
    const error = req.query.error as string;
    const errorReason = req.query.error_reason as string;

    if (error === 'access_denied' || errorReason === 'user_denied') {
      const frontendUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
      return res.redirect(`${frontendUrl}/auth?error=facebook_denied`);
    }

    const user = req.user as any;

    if (!user?.access_token) {
      const frontendUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
      return res.redirect(`${frontendUrl}/auth?error=facebook_auth_failed`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'https://buscampa.com.ar';
    const redirectUrl = `${frontendUrl}/auth/facebook/callback?token=${user.access_token}`;
    return res.redirect(redirectUrl);
  }

  /**
   * Endpoint para iniciar autenticación con X (Twitter) OAuth
   * GET /auth/x
   */
  @Get('x')
  @UseGuards(AuthGuard('x'))
  async xAuth() {}

  /**
   * Callback de X (Twitter) OAuth
   * GET /auth/x/callback
   */
  @Get('x/callback')
  @UseGuards(AuthGuard('x'))
  async xAuthCallback(@Req() req: Request, @Res() res: Response) {
    const error = req.query.error as string;
    const errorReason = req.query.error_reason as string;

    if (error === 'access_denied' || errorReason === 'user_denied') {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth?error=x_denied`);
    }

    const user = req.user as any;

    if (!user || !user.access_token) {
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/auth?error=x_auth_failed`);
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const redirectUrl = `${frontendUrl}/auth/x/callback?token=${user.access_token}`;
    return res.redirect(redirectUrl);
  }
}
