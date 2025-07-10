import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageService, Language } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tarjetas-publica',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `<div class='tarjetas-publica-container'>
    <h1>{{ lang === 'en' ? 'PayPal Cards: Virtual and Physical' : 'Tarjetas PayPal: Virtual y Física' }}</h1>
    <p class="subtitle">{{ lang === 'en' ? 'Discover the two types of cards you can get with your PayPal account.' : 'Descubre los dos tipos de tarjetas que puedes obtener con tu cuenta PayPal.' }}</p>
    <div class="tarjetas-tipos">
      <div class="tarjeta-info virtual">
        <h2>💳 {{ lang === 'en' ? 'Virtual Card' : 'Tarjeta Virtual' }}</h2>
        <ul>
          <li>{{ lang === 'en' ? 'Ideal for online purchases and subscriptions' : 'Ideal para compras online y suscripciones' }}</li>
          <li>{{ lang === 'en' ? 'Generated instantly after registering' : 'Generada al instante tras registrarte' }}</li>
          <li>{{ lang === 'en' ? 'Greater security: you can block or delete it whenever you want' : 'Mayor seguridad: puedes bloquearla o eliminarla cuando quieras' }}</li>
          <li>{{ lang === 'en' ? 'No physical delivery required' : 'No requiere envío físico' }}</li>
        </ul>
      </div>
      <div class="tarjeta-info fisica">
        <h2>🏦 {{ lang === 'en' ? 'Physical Card' : 'Tarjeta Física' }}</h2>
        <ul>
          <li>{{ lang === 'en' ? 'Perfect for purchases in physical stores and ATMs' : 'Perfecta para compras en tiendas físicas y cajeros' }}</li>
          <li>{{ lang === 'en' ? 'Home delivery after your request' : 'Envío a domicilio tras tu solicitud' }}</li>
          <li>{{ lang === 'en' ? 'Compatible with contactless and chip payments' : 'Compatible con pagos contactless y chip' }}</li>
          <li>{{ lang === 'en' ? 'International support' : 'Soporte internacional' }}</li>
        </ul>
      </div>
    </div>
    <div class="ventajas">
      <h2>{{ lang === 'en' ? 'Advantages of our cards' : 'Ventajas de nuestras tarjetas' }}</h2>
      <ul>
        <li>{{ lang === 'en' ? '100% online management from your account' : 'Gestión 100% online desde tu cuenta' }}</li>
        <li>{{ lang === 'en' ? 'Instant blocking and unblocking' : 'Bloqueo y desbloqueo instantáneo' }}</li>
        <li>{{ lang === 'en' ? 'Real-time notifications for every transaction' : 'Notificaciones en tiempo real de cada movimiento' }}</li>
        <li>{{ lang === 'en' ? 'No hidden maintenance fees' : 'Sin costos de mantenimiento ocultos' }}</li>
      </ul>
    </div>
    <div class="cta">
      <a routerLink="/register" class="btn btn-primary">{{ lang === 'en' ? 'Request your card by registering' : 'Solicita tu tarjeta registrándote' }}</a>
    </div>
  </div>`,
  styleUrls: ['./tarjetas-publica.component.css']
})
export class TarjetasPublicaComponent {
  lang: Language;
  constructor(public languageService: LanguageService) {
    this.lang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(l => this.lang = l);
  }
} 