/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Request, Post, UseGuards, Body, Get, Param, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailService } from 'src/email/email.service';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Auth') // Agrupa todas las rutas de este controlador bajo la etiqueta "Auth" en Swagger UI
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private readonly emailService: EmailService) { }

  @UseGuards(AuthGuard('local')) // Usa el guard de autenticación local
  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión de un usuario' }) // Descripción de la operación
  @ApiBody({
    schema: { // Define el esquema del cuerpo de la solicitud para el login
      type: 'object',
      properties: {
        username: { type: 'string', example: 'usuario@example.com' },
        password: { type: 'string', example: 'password123' },
      },
    },
  })
  @ApiResponse({
    status: 200, description: 'Inicio de sesión exitoso', schema: {
      type: 'object',
      properties: {
        access_token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('register')
  @ApiOperation({ summary: 'Registra un nuevo usuario' }) // Descripción de la operación
  @ApiBody({ type: CreateUserDto }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos de registro inválidos o RUT/Email ya existente' })
  async register(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Get('check-rut/:rut')
  @ApiOperation({ summary: 'Verifica si un RUT ya está registrado' }) // Descripción de la operación
  @ApiResponse({
    status: 200, description: 'Retorna true si el RUT existe, false si no', schema: {
      type: 'object',
      properties: {
        exists: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Formato de RUT inválido' })
  async checkRut(@Param('rut') rut: string) {
    return this.authService.checkRutExists(rut);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Solicita un enlace para restablecer la contraseña' }) // Descripción de la operación
  @ApiBody({ type: ForgotPasswordDto }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({ status: 200, description: 'Mensaje de éxito (el email se envía si el usuario existe)' })
  @ApiResponse({ status: 400, description: 'Email inválido' })
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.emailService.sendPasswordResetEmail(forgotPasswordDto.email, forgotPasswordDto.nombre);
    return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
  }

  @Post('send-verification-email')
  @ApiOperation({ summary: 'Envía un email de verificación de cuenta' }) // Descripción de la operación
  @ApiBody({ type: ForgotPasswordDto }) // Reutiliza ForgotPasswordDto para el email y nombre
  @ApiResponse({ status: 200, description: 'Mensaje de éxito (el email se envía si el usuario existe)' })
  @ApiResponse({ status: 400, description: 'Email inválido' })
  async sendEmailVerification(@Body() forgotPasswordDto: ForgotPasswordDto) {
    await this.emailService.sendEmailVerification(forgotPasswordDto.email, forgotPasswordDto.nombre);
    return { message: 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.' };
  }
}
