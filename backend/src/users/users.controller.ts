/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Patch, Body, ValidationPipe, Post, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil de usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil de usuario obtenido correctamente' })
  getProfile(@Request() req) {
    // Assuming the JWT payload has user id
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @ApiOperation({ summary: 'Actualizar datos del perfil del usuario' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente' })
  async updateProfile(@Request() req, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserProfile(req.user.sub, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-bepass')
  @ApiOperation({ summary: 'Verificar clave secundaria (Be Pass)' })
  @ApiBody({ type: VerifyBepassDto })
  @ApiResponse({ status: 200, description: 'Be Pass verificada correctamente' })
  verifyBepass(
    @Request() req,
    @Body(new ValidationPipe()) verifyBepassDto: VerifyBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.verifyBepass(userId, verifyBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('set-bepass')
  @ApiOperation({ summary: 'Establecer o cambiar clave Be Pass' })
  @ApiBody({ type: SetBepassDto })
  @ApiResponse({ status: 200, description: 'Be Pass configurada correctamente' })
  setBepass(
    @Request() req,
    @Body(new ValidationPipe()) setBepassDto: SetBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.setBepass(userId, setBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('has-bepass')
  @ApiOperation({ summary: 'Consultar si el usuario tiene Be Pass' })
  @ApiResponse({ status: 200, description: 'Estado de Be Pass consultado' })
  async hasBepass(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { hasBepass: !!user.bepass };
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/setup')
  @ApiOperation({ summary: 'Generar configuración y QR de 2FA para la app Authenticator' })
  @ApiResponse({ status: 200, description: 'Configuración y QR generados' })
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

  @UseGuards(JwtAuthGuard)
  @Post('2fa/verify')
  @ApiOperation({ summary: 'Verificar código de 2FA generado desde app Authenticator' })
  @ApiBody({ schema: { example: { code: '123456' } } })
  @ApiResponse({ status: 200, description: '2FA activado correctamente' })
  async verify2FA(@Request() req, @Body('code') code: string) {
    const user = await this.usersService.findById(req.user.sub);
    if (!user || !user.totpSecret) throw new UnauthorizedException('2FA no configurado');
    const verified = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
      window: 1
    });
    if (!verified) throw new UnauthorizedException('Código 2FA incorrecto');
    
    // Activar 2FA si la verificación es exitosa
    user.twoFAEnabled = true;
    await this.usersService.save(user);
    
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable-request')
   @UseGuards(JwtAuthGuard)
  @Post('2fa/disable-request')
  @ApiOperation({ summary: 'Solicitar desactivación de 2FA (envía correo)' })
  @ApiResponse({ status: 200, description: 'Solicitud enviada, correo con token generado' })
  async requestDisable2FA(@Request() req) {
    const userId = req.user.sub;
    return this.usersService.requestDisable2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable-confirm')
  @ApiOperation({ summary: 'Confirmar desactivación de 2FA con token enviado por correo' })
  @ApiBody({ schema: { example: { token: 'abcdef123456' } } })
  @ApiResponse({ status: 200, description: '2FA desactivado correctamente' })
  async confirmDisable2FA(@Request() req, @Body('token') token: string) {
    const userId = req.user.sub;
    return this.usersService.confirmDisable2FA(userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/status')
  @ApiOperation({ summary: 'Consultar si el usuario tiene 2FA activado y Be Pass configurado' })
  @ApiResponse({ status: 200, description: 'Estado de 2FA y Be Pass devuelto' })
  async get2FAStatus(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { 
      isEnabled: !!user.twoFAEnabled,
      hasBepass: !!user.bepass 
    };
  }
}
