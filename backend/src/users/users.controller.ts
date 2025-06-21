/* eslint-disable prettier/prettier */
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    // req.user viene del payload del token JWT que contiene { username, sub }
    // "sub" es el id del usuario que establecimos en el login
    return this.usersService.findUserById(req.user.sub);
  }
}
