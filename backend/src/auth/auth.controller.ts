/* eslint-disable prettier/prettier */
// src/auth/auth.controller.ts
import { Controller, Post, UseGuards, Body, Get, Param, ValidationPipe, Res, HttpStatus, Request, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  @Get('verify-email/:token')
  async verifyEmail(@Param('token') token: string, @Res() res: Response) {
    try {
      console.log('Token recibido:', token); // Para debugging
      
      if (!token) {
        throw new BadRequestException('Token no proporcionado');
      }

      const result = await this.authService.verifyEmail(token);
      
      const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>${result.message === '¡Correo verificado correctamente!' ? 'Verificación Exitosa' : 'Error de Verificación'}</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 1rem;
              }
              .success {
                color: #00a65a;
              }
              .error {
                color: #dc3545;
              }
              .message {
                margin: 1rem 0;
                color: #333;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0070ba;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 1rem;
                transition: background-color 0.3s;
              }
              .button:hover {
                background-color: #005ea6;
              }
              .logo {
                max-width: 100px;
                margin-bottom: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal Logo" class="logo">
              ${result.message === '¡Correo verificado correctamente!' 
                ? `<div class="icon success">✓</div>
                   <h1>¡Email Verificado!</h1>
                   <p class="message">Tu correo electrónico ha sido verificado correctamente.</p>` 
                : `<div class="icon error">✕</div>
                   <h1>Error de Verificación</h1>
                   <p class="message">${result.message}</p>`}
              <a href="/login" class="button">Ir al inicio de sesión</a>
            </div>
            <script>
              // Redirigir después de 5 segundos
              setTimeout(() => {
                window.location.href = '/login';
              }, 5000);
            </script>
          </body>
        </html>
      `;

      return res.send(htmlResponse);
    } catch (error) {
      console.error('Error en la verificación:', error);
      return res.status(500).send(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Error Inesperado</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background-color: #f5f5f5;
              }
              .container {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                text-align: center;
                max-width: 400px;
                width: 90%;
              }
              .icon {
                font-size: 48px;
                margin-bottom: 1rem;
                color: #dc3545;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #0070ba;
                color: white;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 1rem;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="icon">✕</div>
              <h1>Error Inesperado</h1>
              <p>Ha ocurrido un error al procesar tu solicitud. Por favor, intenta nuevamente más tarde.</p>
              <a href="/login" class="button">Volver al inicio</a>
            </div>
          </body>
        </html>
      `);
    }
  }
  constructor(private authService: AuthService) { }

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
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('send-verification-email')
  async sendVerificationEmail(@Body('email') email: string) {
    return this.authService.sendVerificationEmail(email);
  }
}
