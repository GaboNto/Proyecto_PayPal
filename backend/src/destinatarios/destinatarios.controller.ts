/* eslint-disable prettier/prettier */
import { Controller, Post, Body, UseGuards, Req, Get, Patch, Param, ParseIntPipe, HttpCode, HttpStatus, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { DestinatariosService } from './destinatarios.service';
import { CreateDestinatarioDto } from './dto/create-destinatario.dto';
import { UsersService } from 'src/users/users.service';
import { UpdateDestinatarioDto } from './dto/update-destinatario.dto';
// Importa los decoradores de Swagger
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('Destinatarios') // Agrupa todas las rutas de este controlador bajo la etiqueta "Destinatarios" en Swagger UI
@UseGuards(JwtAuthGuard) // Protege todas las rutas de este controlador con JWT
@Controller('destinatarios')
export class DestinatariosController {
  constructor(
    private readonly destinatariosService: DestinatariosService,
    private readonly usersService: UsersService,
  ) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('access-token') // Indica que este endpoint requiere un token JWT
  @ApiOperation({ summary: 'Crea un nuevo destinatario para el usuario autenticado' }) // Descripción de la operación
  @ApiBody({ type: CreateDestinatarioDto, description: 'Datos del nuevo destinatario' }) // Especifica el DTO para el cuerpo de la solicitud
  @ApiResponse({
    status: 201,
    description: 'Destinatario creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        email: { type: 'string', example: 'juan.perez@example.com' },
        rut: { type: 'string', example: '12345678-9' },
        numero_cuenta: { type: 'string', example: 'CL123456789' },
        banco: { type: 'string', example: 'Banco Ejemplo' },
        tipo_cuenta: { type: 'string', example: 'Cuenta Corriente' },
        favorito: { type: 'boolean', example: false },
        // ... otras propiedades de la entidad Destinatario
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de destinatario inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 404, description: 'Usuario propietario no encontrado' })
  async create(@Body() createDestinatarioDto: CreateDestinatarioDto, @Req() req) {
    const userId = req.user.sub;
    const propietario = await this.usersService.findById(userId);
    return this.destinatariosService.create(createDestinatarioDto, propietario);
  }

  @Get()
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Obtiene todos los destinatarios del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Lista de destinatarios del usuario',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          nombre: { type: 'string', example: 'Juan' },
          apellido: { type: 'string', example: 'Pérez' },
          email: { type: 'string', example: 'juan.perez@example.com' },
          rut: { type: 'string', example: '12345678-9' },
          numero_cuenta: { type: 'string', example: 'CL123456789' },
          banco: { type: 'string', example: 'Banco Ejemplo' },
          tipo_cuenta: { type: 'string', example: 'Cuenta Corriente' },
          favorito: { type: 'boolean', example: false },
          // ... otras propiedades de la entidad Destinatario
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  async findAll(@Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.findByPropietarioId(userId);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Actualiza un destinatario existente del usuario autenticado' })
  @ApiParam({ name: 'id', description: 'ID del destinatario a actualizar', type: 'integer', example: 1 })
  @ApiBody({ type: UpdateDestinatarioDto, description: 'Datos a actualizar del destinatario' })
  @ApiResponse({
    status: 200,
    description: 'Destinatario actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        nombre: { type: 'string', example: 'Juan' },
        apellido: { type: 'string', example: 'Pérez' },
        // ... otras propiedades de la entidad Destinatario
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Datos de actualización inválidos' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido (el destinatario no pertenece al usuario)' })
  @ApiResponse({ status: 404, description: 'Destinatario no encontrado' })
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
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Elimina un destinatario del usuario autenticado' })
  @ApiParam({ name: 'id', description: 'ID del destinatario a eliminar', type: 'integer', example: 1 })
  @ApiResponse({ status: 204, description: 'Destinatario eliminado exitosamente (No Content)' })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido (el destinatario no pertenece al usuario)' })
  @ApiResponse({ status: 404, description: 'Destinatario no encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.delete(id, userId);
  }

  @Patch(':id/favorito')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Alterna el estado de favorito de un destinatario' })
  @ApiParam({ name: 'id', description: 'ID del destinatario', type: 'integer', example: 1 })
  @ApiResponse({
    status: 200,
    description: 'Estado de favorito del destinatario actualizado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'integer', example: 1 },
        favorito: { type: 'boolean', example: true },
        // ... otras propiedades de la entidad Destinatario
      }
    }
  })
  @ApiResponse({ status: 401, description: 'No autorizado' })
  @ApiResponse({ status: 403, description: 'Acceso prohibido (el destinatario no pertenece al usuario)' })
  @ApiResponse({ status: 404, description: 'Destinatario no encontrado' })
  async toggleFavorito(@Param('id', ParseIntPipe) id: number, @Req() req) {
    const userId = req.user.sub;
    return this.destinatariosService.toggleFavorito(id, userId);
  }
}
