/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get, Param, ValidationPipe, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión con email y contraseña' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@email.com' },
        password: { type: 'string', example: 'MiContraseña123' },
      },
    },
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('check-rut/:rut')
  @ApiOperation({ summary: 'Verifica si un RUT ya está registrado' })
  @ApiParam({
    name: 'rut',
    description: 'RUT chileno del usuario a verificar. Ejemplo: 12345678-9',
    example: '12345678-9',
  })
  async checkRut(@Param('rut') rut: string) {
    return this.authService.checkRutExists(rut);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicitar restablecimiento de contraseña' })
  @ApiBody({ type: ForgotPasswordDto })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: 'Enviar correo de verificación de cuenta' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'usuario@email.com' },
      },
    },
  })
  async sendVerificationEmail(@Body('email') email: string) {
    return this.authService.sendEmailVerification(email);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verificar cuenta a través del token de email' })
  @ApiQuery({
    name: 'token',
    description: 'Token de verificación enviado al correo',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmailToken(token);
  }
}
