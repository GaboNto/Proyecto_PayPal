/*eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Patch, Body, ValidationPipe, Post, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Users') //aqui agrupamos todo el controlador con el tag de "user"
@ApiBearerAuth() //las ru tas usan JWT
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' }) //para describir que hace
  @ApiResponse({ status: 200, description: 'Perfil del usuario retornado exitosamente' })// lo que deberia retornar
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  getProfile(@Request() req) {
    // Assuming the JWT payload has user id
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-bepass')
  @ApiOperation({ summary: 'Verificar la clave bepass del usuario' })
  @ApiResponse({ status: 200, description: 'Bepass verificado correctamente' })
  @ApiBody({ type: VerifyBepassDto })
  verifyBepass(
    @Request() req,
    @Body(new ValidationPipe()) verifyBepassDto: VerifyBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.verifyBepass(userId, verifyBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('set-bepass')
  @ApiOperation({ summary: 'Configurar clave bepass para el usuario' })
  @ApiResponse({ status: 200, description: 'Bepass configurado correctamente' })
  @ApiBody({ type: SetBepassDto })
  setBepass(
    @Request() req,
    @Body(new ValidationPipe()) setBepassDto: SetBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.setBepass(userId, setBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('has-bepass')
  @ApiOperation({ summary: 'Verifica si el usuario tiene clave bepass configurada' })
  @ApiResponse({ status: 200, description: 'Retorna un booleano indicando si bepass está configurado' })
  async hasBepass(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { hasBepass: !!user.bepass };
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/setup')
  @ApiOperation({ summary: 'Generar QR para configurar 2FA (Google Authenticator)' })
  @ApiResponse({ status: 200, description: 'Secret y QR code para configurar 2FA' })
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
  @ApiOperation({ summary: 'Verificar código 2FA ingresado por el usuario' })
  @ApiResponse({ status: 200, description: '2FA verificado correctamente' })
  @ApiResponse({ status: 401, description: '2FA no configurado o código incorrecto' })
  @ApiBody({ schema: { type: 'object', properties: { code: { type: 'string', description: 'Código 2FA de 6 dígitos' } } } })
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
    return { success: true };
  }
}
