import { Controller, Post, Body, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/auth.guard';
import { GetUser } from './decorators/user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterChurchDto } from './dto/register-church.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { DeleteAccountDto } from './dto/delete-account.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(@Body() dto: RegisterUserDto) {
    return this.authService.registerUser(dto);
  }

  @Post('register/church')
  async registerChurch(@Body() dto: RegisterChurchDto) {
    return this.authService.registerChurch(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@GetUser() user: any) {
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put('me')
  updateProfile(@Body() dto: any, @GetUser() user: any) {
    return this.authService.updateProfile(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password')
  changePassword(@Body() dto: any, @GetUser() user: any) {
    return this.authService.changePassword(dto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Put('delete-account')
  deleteAccount(@Body() body: { password: string }, @GetUser() user: any) {
    return this.authService.deleteAccount(body.password, user);
  }
}
