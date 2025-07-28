/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable prettier/prettier */
import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { EmailService } from './email.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { SendPasswordResetEmailDto } from './dto/send-password-reset-email.dto';

@ApiTags('Email') // Agrupa todas las rutas de este controlador bajo la etiqueta "Email" en Swagger UI
@Controller('email') // Define la ruta base para este controlador, por ejemplo, /api/email
export class EmailController {
    constructor(private readonly emailService: EmailService) { }



    @Post('send-password-reset')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Envía un correo de restablecimiento de contraseña con un enlace proporcionado.' })
    @ApiBody({ type: SendPasswordResetEmailDto, description: 'Datos del destinatario y el enlace de restablecimiento. Este endpoint es para uso interno o administrativo, ya que el enlace debe ser generado por el servidor.' })
    @ApiResponse({ status: 200, description: 'Correo de restablecimiento de contraseña enviado exitosamente.' })
    @ApiResponse({ status: 400, description: 'Datos de la solicitud inválidos (ej. email o enlace no válidos).' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor al enviar el correo.' })

    async sendPasswordResetEmail(@Body() sendResetDto: SendPasswordResetEmailDto) {
        // Llama al servicio de correo para enviar el email de restablecimiento
        await this.emailService.sendPasswordResetEmail(sendResetDto.to);
        return { message: 'Correo de restablecimiento de contraseña enviado exitosamente.' };
    }
}
