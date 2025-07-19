/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, ParseIntPipe, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinatariosService } from './destinatarios.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('destinatarios')
@UseGuards(JwtAuthGuard)
@Controller('destinatarios')
export class DestinatariosController {
  constructor(
      private readonly destinatariosService: DestinatariosService,
      private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear nuevo destinatario' })
  @ApiBody({ type: CreateDestinatarioDto })
  @ApiResponse({
    status: 201,
    description: 'Destinatario creado correctamente',
  })
  async create(@Body() createDestinatarioDto: CreateDestinatarioDto, @Req() req) {
    const userId = req.user.sub;
    const propietario = await this.usersService.findById(userId);
    return this.destinatariosService.create(createDestinatarioDto, propietario);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los destinatarios del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de destinatarios obtenida correctamente',
  })
  async findAll(@Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.findByPropietarioId(userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un destinatario existente' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del destinatario' })
  @ApiBody({ type: UpdateDestinatarioDto })
  @ApiResponse({
    status: 200,
    description: 'Destinatario actualizado correctamente',
  })
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
  @ApiOperation({ summary: 'Eliminar un destinatario por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del destinatario' })
  @ApiResponse({
    status: 204,
    description: 'Destinatario eliminado correctamente',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.delete(id, userId);
  }

  @Patch(':id/favorito')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar o desmarcar destinatario como favorito' })
  @ApiParam({ name: 'id', type: Number, description: 'ID del destinatario' })
  @ApiResponse({
    status: 200,
    description: 'Estado de favorito actualizado correctamente',
  })
  async toggleFavorito(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.toggleFavorito(id, userId);
  }
} 