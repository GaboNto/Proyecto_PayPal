/**
 * Componente encargado de gestionar pagos automáticos recurrentes,
 * permitiendo agregar, eliminar y activar/desactivar servicios como suscripciones.
 *
 * @component
 * @selector app-pay
 * @template ./pay.component.html
 * @style ./pay.component.css
 */
import { Component } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
/**
 * Interfaz que representa un pago automático registrado por el usuario.
 */
interface PagoAutomatico {
  nombre: string;
  monto: number;
  diaPago: string; // "05", "15", "28", etc.
  activo: boolean;
}

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, FormsModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent {
    /**
   * Lista de pagos automáticos registrados.
   */
  pagos: PagoAutomatico[] = [
    { nombre: 'Netflix', monto: 8990, diaPago: '05', activo: true },
    { nombre: 'Spotify', monto: 4990, diaPago: '15', activo: true },
    { nombre: 'Luz', monto: 25990, diaPago: '28', activo: false },
    { nombre: 'Agua', monto: 15990, diaPago: '10', activo: true },
  ];

  /**
   * Modelo temporal para crear un nuevo pago.
   */
  nuevoPago: PagoAutomatico = { nombre: '', monto: 0, diaPago: '01', activo: true };
  
  /**
   * Controla si el formulario de nuevo pago está visible.
   */
  mostrarFormulario: boolean = false;
    /**
   * Controla si el ticket de confirmación está visible.
   */
  mostrarTicket: boolean = false;
    /**
   * Almacena temporalmente el pago en espera de confirmación.
   */
  pagoPendiente: PagoAutomatico | null = null;

  /**
   * Calcula el total de gastos fijos activos.
   *
   * @returns Total en CLP de los pagos activos
   */
  get gastosFijos(): number {
    return this.pagos.filter(p => p.activo).reduce((acc, p) => acc + p.monto, 0);
  }
  /**
   * Prepara un nuevo pago para su confirmación.
   * Muestra un ticket resumen antes de agregarlo a la lista.
   */
  agregarPago() {
    if (this.nuevoPago.nombre && this.nuevoPago.monto > 0 && this.nuevoPago.diaPago) {
      this.pagoPendiente = { ...this.nuevoPago };
      this.mostrarTicket = true;
    }
  }
  /**
   * Confirma y guarda el pago pendiente en la lista principal.
   */
  confirmarPago() {
    if (this.pagoPendiente) {
      this.pagos.push(this.pagoPendiente);
      this.nuevoPago = { nombre: '', monto: 0, diaPago: '01', activo: true };
      this.mostrarFormulario = false;
      this.mostrarTicket = false;
      this.pagoPendiente = null;
    }
  }
  /**
   * Cancela la visualización del ticket sin guardar el pago.
   */
  cancelarTicket() {
    this.mostrarTicket = false;
    this.pagoPendiente = null;
  }

  /**
   * Elimina un pago de la lista.
   *
   * @param index - Índice del pago a eliminar
   */
  eliminarPago(index: number) {
    this.pagos.splice(index, 1);
  }
  /**
   * Cambia el estado activo/inactivo de un pago.
   *
   * @param pago - Pago a modificar
   */
  alternarActivo(pago: PagoAutomatico) {
    pago.activo = !pago.activo;
  }
  /**
   * Muestra el formulario para agregar un nuevo pago.
   */
  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  /**
   * Oculta el formulario y reinicia el modelo de nuevo pago.
   */
  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.nuevoPago = { nombre: '', monto: 0, diaPago: '01', activo: true };
  }
}
