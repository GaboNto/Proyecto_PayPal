/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request, Patch, Body, ValidationPipe, Post, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SetBepassDto } from './dto/set-bepass.dto';
import { VerifyBepassDto } from './dto/verify-bepass.dto';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // Assuming the JWT payload has user id
    return this.usersService.findById(req.user.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body(new ValidationPipe()) updateUserDto: UpdateUserDto) {
    return this.usersService.updateUserProfile(req.user.sub, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('verify-bepass')
  verifyBepass(
    @Request() req,
    @Body(new ValidationPipe()) verifyBepassDto: VerifyBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.verifyBepass(userId, verifyBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('set-bepass')
  setBepass(
    @Request() req,
    @Body(new ValidationPipe()) setBepassDto: SetBepassDto,
  ) {
    const userId = req.user.sub;
    return this.usersService.setBepass(userId, setBepassDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('has-bepass')
  async hasBepass(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { hasBepass: !!user.bepass };
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/setup')
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
  async requestDisable2FA(@Request() req) {
    const userId = req.user.sub;
    return this.usersService.requestDisable2FA(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('2fa/disable-confirm')
  async confirmDisable2FA(@Request() req, @Body('token') token: string) {
    const userId = req.user.sub;
    return this.usersService.confirmDisable2FA(userId, token);
  }

  @UseGuards(JwtAuthGuard)
  @Get('2fa/status')
  async get2FAStatus(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return { 
      isEnabled: !!user.twoFAEnabled,
      hasBepass: !!user.bepass 
    };
  }
}
