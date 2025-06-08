import { Component } from '@angular/core';
import { CommonModule, NgFor, NgClass, DecimalPipe } from '@angular/common';

interface Contacto {
  nombre: string;
  rut: string;
  banco: string;
  tipoCuenta: string;
  numeroCuenta: string;
  favorito: boolean;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NgFor, NgClass, DecimalPipe],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css'
})
export class TransactionsComponent {
  saldoActual: number = 890000;
  contactos: Contacto[] = [
    { nombre: 'Gabriel Pailamilla', rut: '21.123.456-7', banco: 'Banco de Chile', tipoCuenta: 'Cuenta Vista', numeroCuenta: '0 000 54 12028 3', favorito: true },
    { nombre: 'Manuel Lopez', rut: '20.234.567-8', banco: 'Banco Santander', tipoCuenta: 'Cuenta Corriente', numeroCuenta: '0 000 54 12028 3', favorito: true },
    { nombre: 'Kevin Rojas', rut: '21.345.678-9', banco: 'BCI / Mach', tipoCuenta: 'Cuenta Vista', numeroCuenta: '0 000 54 12028 3', favorito: true },
    { nombre: 'Sebastian Cavupi', rut: '20.456.789-0', banco: 'Mercado Pago', tipoCuenta: 'Cuenta Vista', numeroCuenta: '0 000 54 12028 3', favorito: true },
    { nombre: 'Felipe Guzman', rut: '21.567.890-1', banco: 'Banco Estado', tipoCuenta: 'Cuenta Rut', numeroCuenta: '0 000 54 12028 3', favorito: false },
    { nombre: 'Bryan Vidaurre', rut: '20.678.901-2', banco: 'Banco Estado', tipoCuenta: 'Cuenta Rut', numeroCuenta: '0 000 54 12028 3', favorito: false },
    { nombre: 'Juan Meneses', rut: '21.789.012-3', banco: 'Banco Estado', tipoCuenta: 'Cuenta Rut', numeroCuenta: '0 000 54 12028 3', favorito: false },
    { nombre: 'Gabriel Pailamilla', rut: '21.123.456-7', banco: 'Copec Pay', tipoCuenta: 'Cuenta Vista', numeroCuenta: '0 000 54 12028 3', favorito: true },

  ];

  get contactosOrdenados(): Contacto[] {
    return this.contactos.slice().sort((a, b) => Number(b.favorito) - Number(a.favorito));
  }

  toggleFavorito(contacto: Contacto) {
    contacto.favorito = !contacto.favorito;
  }
}
