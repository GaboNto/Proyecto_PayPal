/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/email/email.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly emailService: EmailService) { }

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
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.emailService.sendPasswordResetEmail(forgotPasswordDto.email, forgotPasswordDto.nombre);
    return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
  }

  @Post('send-verification-email')
  async sendEmailVerification(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.emailService.sendEmailVerification(forgotPasswordDto.email, forgotPasswordDto.nombre);
    return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
  }
}
