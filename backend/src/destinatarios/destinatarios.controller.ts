import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, ParseIntPipe, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinatariosService } from './destinatarios.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';

@UseGuards(JwtAuthGuard)
@Controller('destinatarios')
export class DestinatariosController {
  constructor(
      private readonly destinatariosService: DestinatariosService,
      private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDestinatarioDto: CreateDestinatarioDto, @Req() req) {
    const userId = req.user.sub;
    const propietario = await this.usersService.findById(userId);
    return this.destinatariosService.create(createDestinatarioDto, propietario);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.findByPropietarioId(userId);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDestinatarioDto: UpdateDestinatarioDto,
    @Req() req,
  ) {
    const userId = req.user.sub;
    return this.destinatariosService.update(id, userId, updateDestinatarioDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.delete(id, userId);
  }

  @Patch(':id/favorito')
  @HttpCode(HttpStatus.OK)
  async toggleFavorito(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.toggleFavorito(id, userId);
  }
} 