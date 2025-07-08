import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-tarjetas-publica',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div class='tarjetas-publica-container'>
    <h1>Tarjetas PayPal: Virtual y Física</h1>
    <p class="subtitle">Descubre los dos tipos de tarjetas que puedes obtener con tu cuenta PayPal.</p>
    <div class="tarjetas-tipos">
      <div class="tarjeta-info virtual">
        <h2>💳 Tarjeta Virtual</h2>
        <ul>
          <li>Ideal para compras online y suscripciones</li>
          <li>Generada al instante tras registrarte</li>
          <li>Mayor seguridad: puedes bloquearla o eliminarla cuando quieras</li>
          <li>No requiere envío físico</li>
        </ul>
      </div>
      <div class="tarjeta-info fisica">
        <h2>🏦 Tarjeta Física</h2>
        <ul>
          <li>Perfecta para compras en tiendas físicas y cajeros</li>
          <li>Envío a domicilio tras tu solicitud</li>
          <li>Compatible con pagos contactless y chip</li>
          <li>Soporte internacional</li>
        </ul>
      </div>
    </div>
    <div class="ventajas">
      <h2>Ventajas de nuestras tarjetas</h2>
      <ul>
        <li>Gestión 100% online desde tu cuenta</li>
        <li>Bloqueo y desbloqueo instantáneo</li>
        <li>Notificaciones en tiempo real de cada movimiento</li>
        <li>Sin costos de mantenimiento ocultos</li>
      </ul>
    </div>
    <div class="cta">
      <a routerLink="/register" class="btn btn-primary">Solicita tu tarjeta registrándote</a>
    </div>
  </div>`,
  styleUrls: ['./tarjetas-publica.component.css']
})
export class TarjetasPublicaComponent {} 