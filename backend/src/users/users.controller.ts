/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Patch, Body, ValidationPipe, Post, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Users') // Agrupa todas las rutas de este controlador bajo la etiqueta "Users" en Swagger UI
@Controller('users') // Define la ruta base para este controlador, por ejemplo, /api/users
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @UseGuards(JwtAuthGuard) // Protege este endpoint, requiriendo un token JWT válido
  @Get('profile') // Maneja solicitudes GET a /api/users/profile
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Obtiene el perfil del usuario autenticado' }) // Descripción de la operación
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        email: { type: 'string', example: 'juan.perez@example.com' },
        rut: { type: 'string', example: '12345678-9' },
        // ... otras propiedades del usuario
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado (token JWT inválido o ausente)' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  getProfile(@Request() req) {
    // Assuming the JWT payload has user id
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Post('verify-bepass') // Maneja solicitudes POST a /api/users/verify-bepass
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verifica la clave BePass del usuario' })
  @ApiBody({ type: VerifyBepassDto, description: 'Clave BePass a verificar' })
  @ApiResponse({
    status: 200, description: 'Clave BePass verificada exitosamente', schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado o clave BePass incorrecta' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  verifyBepass(
    @Request() req,
    @Body(new ValidationPipe()) verifyBepassDto: VerifyBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.verifyBepass(userId, verifyBepassDto);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Patch('set-bepass') // Maneja solicitudes PATCH a /api/users/set-bepass
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Establece o actualiza la clave BePass del usuario' })
  @ApiBody({ type: SetBepassDto, description: 'Nueva clave BePass y contraseña actual' })
  @ApiResponse({
    status: 200, description: 'Clave BePass establecida/actualizada exitosamente', schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o contraseña actual incorrecta' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  setBepass(
    @Request() req,
    @Body(new ValidationPipe()) setBepassDto: SetBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.setBepass(userId, setBepassDto);
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Get('has-bepass') // Maneja solicitudes GET a /api/users/has-bepass
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verifica si el usuario tiene una clave BePass configurada' })
  @ApiResponse({
    status: 200, description: 'Estado de BePass del usuario', schema: {
      type: 'object',
      properties: {
        hasBepass: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async hasBepass(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { hasBepass: !!user.bepass };
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Get('2fa/setup') // Maneja solicitudes GET a /api/users/2fa/setup
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Inicia la configuración de la autenticación de dos factores (2FA) para el usuario' })
  @ApiResponse({
    status: 200, description: 'Retorna el secreto TOTP y un código QR para configurar 2FA', schema: {
      type: 'object',
      properties: {
        secret: { type: 'string', example: 'JBSWY3DPEHPK3PXP' },
        qr: { type: 'string', example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...' } // Base64 encoded QR image
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async setup2FA(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    if (!user.totpSecret) {
      const secret = speakeasy.generateSecret({ name: `PayPal (${user.email})` });
      user.totpSecret = secret.base32;
      await this.usersService.save(user);
    }
    const otpauth = speakeasy.otpauthURL({
      secret: user.totpSecret,
      label: `PayPal (${user.email})`,
      issuer: 'PayPal',
      encoding: 'base32',
    });
    const qr = await qrcode.toDataURL(otpauth);
    return { secret: user.totpSecret, qr };
  }

  @UseGuards(JwtAuthGuard) // Protege este endpoint
  @Post('2fa/verify') // Maneja solicitudes POST a /api/users/2fa/verify
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Verifica el código TOTP para la autenticación de dos factores (2FA)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        code: { type: 'string', example: '123456', minLength: 6, maxLength: 6 }
      },
      required: ['code']
    },
    description: 'Código TOTP de 6 dígitos generado por la aplicación de autenticación'
  })
  @ApiResponse({
    status: 200, description: 'Código 2FA verificado exitosamente', schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado o código 2FA incorrecto/no configurado' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async verify2FA(@Request() req, @Body('code') code: string) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user || !user.totpSecret) throw new UnauthorizedException('2FA no configurado');
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
      window: 1 // Permite un desfase de 1 período de tiempo (30 segundos)
    });
    if (!verified) throw new UnauthorizedException('Código 2FA incorrecto');
    return { success: true };
  }
}
