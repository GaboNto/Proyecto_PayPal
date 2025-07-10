import { Component } from '@angular/core';
import { CommonModule, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface PagoAutomatico {
  nombre: string;
  monto: number;
  diaPago: string; // "05", "15", "28", etc.
  activo: boolean;
}

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, FormsModule, TranslateModule],
  templateUrl: './pay.component.html',
  styleUrl: './pay.component.css'
})
export class PayComponent {
  pagos: PagoAutomatico[] = [
    { nombre: 'Netflix', monto: 8990, diaPago: '05', activo: true },
    { nombre: 'Spotify', monto: 4990, diaPago: '15', activo: true },
    { nombre: 'Luz', monto: 25990, diaPago: '28', activo: false },
    { nombre: 'Agua', monto: 15990, diaPago: '10', activo: true },
  ];

  nuevoPago: PagoAutomatico = { nombre: '', monto: 0, diaPago: '01', activo: true };
  mostrarFormulario: boolean = false;
  mostrarTicket: boolean = false;
  pagoPendiente: PagoAutomatico | null = null;

  constructor(private router: Router) {}

  get gastosFijos(): number {
    return this.pagos.filter(p => p.activo).reduce((acc, p) => acc + p.monto, 0);
  }

  agregarPago() {
    if (this.nuevoPago.nombre && this.nuevoPago.monto > 0 && this.nuevoPago.diaPago) {
      this.pagoPendiente = { ...this.nuevoPago };
      this.mostrarTicket = true;
    }
  }

  confirmarPago() {
    if (this.pagoPendiente) {
      this.pagos.push(this.pagoPendiente);
      this.nuevoPago = { nombre: '', monto: 0, diaPago: '01', activo: true };
      this.mostrarFormulario = false;
      this.mostrarTicket = false;
      this.pagoPendiente = null;
    }
  }

  cancelarTicket() {
    this.mostrarTicket = false;
    this.pagoPendiente = null;
  }

  eliminarPago(index: number) {
    this.pagos.splice(index, 1);
  }

  alternarActivo(pago: PagoAutomatico) {
    pago.activo = !pago.activo;
  }

  abrirFormulario() {
    this.mostrarFormulario = true;
  }

  cancelarFormulario() {
    this.mostrarFormulario = false;
    this.nuevoPago = { nombre: '', monto: 0, diaPago: '01', activo: true };
  }

  irATransferir() {
    // Suponiendo que el token de autenticación se guarda en localStorage con la clave 'token'
    const isLoggedIn = !!localStorage.getItem('token');
    if (isLoggedIn) {
      this.router.navigate(['/transactions']);
    } else {
      this.router.navigate(['/transactions-public']);
    }
  }
}
