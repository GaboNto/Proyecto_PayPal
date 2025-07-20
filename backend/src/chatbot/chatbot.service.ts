/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/chatbot/chatbot.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { Pago } from 'src/pagos/entities/pago.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Cuenta } from 'src/cuentas/entities/cuenta.entity';

@Injectable()
export class ChatbotService {

  constructor(
    @InjectRepository(Pago)
    private readonly pagoRepo: Repository<Pago>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Cuenta)
    private readonly cuentasRepo: Repository<Cuenta>,
  ) { }
  private readonly API_KEY = 'AIzaSyBc3sUrI2LB5458o0qOQwluHKP1O4dU5HY';
  private readonly MODEL = 'gemini-2.0-flash-lite';
  private readonly API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${this.MODEL}:generateContent?key=${this.API_KEY}`;

  async enviarMensaje(prompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.API_URL,
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // Se asume la estructura esperada de response.data
      const data = response.data as { candidates?: { content?: { parts?: { text?: string }[] } }[] };
      const output = data.candidates?.[0]?.content?.parts?.[0]?.text;
      return output || 'Sin respuesta del modelo.';
    } catch (error) {
      console.error('Error al usar Gemini:', error.response?.data || error.message);
      throw new InternalServerErrorException('Error al comunicarse con Gemini');
    }
  }

  async getPagos(userId: string): Promise<string> {
    const pagos = await this.pagoRepo.find({
      where: { idusuario: Number(userId) }
    });
    if (!pagos.length) return 'No hay pagos registrados.';

    const lista = pagos.map(p => {
      const fechaLocal = p.fecha.toLocaleString('es-CL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      return `Descripción: ${p.descripcion}, Monto: $${p.monto}, Fecha: ${fechaLocal}, Categoría: ${p.categoria}`;
    }).join('\n');

    return `Historial de pagos del usuario:\n${lista}`;
  }


  async obtenerCuentasPorUsuario(id_usuario: number): Promise<Cuenta[]> {
    return this.cuentasRepo.find({
      where: {
        usuario: { id_usuario },
      },
    });
  }

  public limpiarCuentas(cuentas: any[]) {
    return cuentas.map(cuenta => {
      const { movimientos, cards, usuario, ...restCuenta } = cuenta;
      const { password, bepass, totpSecret, cuentas, destinatarios, ...restUsuario } = usuario;

      return {
        ...restCuenta,
        usuario: restUsuario,
      };
    });
  }

  public formatearCuentas(cuentas: any[]): string {
    return cuentas.map(cuenta => {
      const { usuario, movimientos, cards, ...restCuenta } = cuenta;
      const { password, bepass, totpSecret, cuentas, destinatarios, ...restUsuario } = usuario || {};

      return `Número de cuenta: ${restCuenta.numero_cuenta}, Tipo: ${restCuenta.tipo_cuenta}, Saldo: $${restCuenta.saldo}, Usuario: ${restUsuario?.nombre} ${restUsuario?.apellido}, Email: ${restUsuario?.email}`;
    }).join('\n');
  }

}
