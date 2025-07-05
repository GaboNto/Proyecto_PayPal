/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('check-rut/:rut')
  async checkRut(@Param('rut') rut: string) {
    return this.authService.checkRutExists(rut);
  }

  @Post('forgot-password')
  async forgotPassword(@Body(new ValidationPipe()) forgotPasswordDto: ForgotPasswordDto) {
    // Lógica a implementar
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  async resetPassword(@Body(new ValidationPipe()) resetPasswordDto: ResetPasswordDto) {
    // Lógica a implementar
    return this.authService.resetPassword(resetPasswordDto);
  }
}
