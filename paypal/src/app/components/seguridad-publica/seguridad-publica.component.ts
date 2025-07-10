import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-seguridad-publica',
  standalone: true,
  imports: [CommonModule],
  template: `<div class='seguridad-publica-container'>
      <h1>{{ lang === 'en' ? 'Security at PayPal' : 'Seguridad en PayPal' }}</h1>
      <p class="subtitle">{{ lang === 'en' ? 'Your security is our priority. Discover how we protect your data and transactions, even before you register.' : 'Tu seguridad es nuestra prioridad. Descubre cómo protegemos tus datos y transacciones, incluso antes de que te registres.' }}</p>
      <ul class="seguridad-list">
        <li>🔒 {{ lang === 'en' ? 'End-to-end encrypted payments' : 'Pagos cifrados de extremo a extremo' }}</li>
        <li>🛡️ {{ lang === 'en' ? 'Protection against fraud and impersonation' : 'Protección contra fraudes y suplantación' }}</li>
        <li>👀 {{ lang === 'en' ? 'We never share your banking data with merchants' : 'Nunca compartimos tus datos bancarios con los comercios' }}</li>
        <li>💬 {{ lang === 'en' ? '24/7 support for any security inquiry' : 'Soporte 24/7 para cualquier consulta de seguridad' }}</li>
        <li>🔔 {{ lang === 'en' ? 'Alerts and notifications of suspicious activity' : 'Alertas y notificaciones de actividad sospechosa' }}</li>
      </ul>
      <div class="extra-seguridad">
        <h2>{{ lang === 'en' ? 'Buyer Protection' : 'Protección al Comprador' }}</h2>
        <p>{{ lang === 'en' ? 'If your purchase does not arrive or is not what you expected, you can easily request a refund. PayPal has your back in every transaction.' : 'Si tu compra no llega o no es lo que esperabas, puedes solicitar un reembolso fácilmente. PayPal te respalda en cada transacción.' }}</p>
        <h2>{{ lang === 'en' ? 'Two-Factor Authentication (2FA)' : 'Autenticación en Dos Pasos (2FA)' }}</h2>
        <p>{{ lang === 'en' ? 'We offer 2FA so that only you can access your account, even if someone else knows your password.' : 'Ofrecemos autenticación 2FA para que solo tú puedas acceder a tu cuenta, incluso si alguien más conoce tu contraseña.' }}</p>
        <h2>{{ lang === 'en' ? 'Security tips' : 'Consejos para tu seguridad' }}</h2>
        <ul class="consejos-list">
          <li>{{ lang === 'en' ? 'Use strong passwords and change them periodically' : 'Utiliza contraseñas seguras y cámbialas periódicamente' }}</li>
          <li>{{ lang === 'en' ? 'Do not share your access data with anyone' : 'No compartas tus datos de acceso con nadie' }}</li>
          <li>{{ lang === 'en' ? 'Always check the URL before entering your credentials' : 'Verifica siempre la URL antes de ingresar tus credenciales' }}</li>
          <li>{{ lang === 'en' ? 'Enable notifications to stay aware of any activity' : 'Activa las notificaciones para estar al tanto de cualquier movimiento' }}</li>
        </ul>
        <div class="enlaces-utiles">
          <h3>{{ lang === 'en' ? 'Useful links' : 'Enlaces útiles' }}</h3>
          <ul>
            <li><a href="https://www.paypal.com/es/webapps/mpp/paypal-safety-and-security" target="_blank">{{ lang === 'en' ? 'More about PayPal security' : 'Más sobre seguridad en PayPal' }}</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ1982" target="_blank">{{ lang === 'en' ? 'How does PayPal protect me?' : '¿Cómo me protege PayPal?' }}</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ2254" target="_blank">{{ lang === 'en' ? 'Tips to avoid fraud' : 'Consejos para evitar fraudes' }}</a></li>
          </ul>
        </div>
      </div>
      <div class="cta">
        <a routerLink="/register" class="btn btn-primary">{{ lang === 'en' ? 'Create your account and shop safely' : 'Crea tu cuenta y compra seguro' }}</a>
      </div>
    </div>`,
  styleUrls: ['./seguridad-publica.component.css']
})
export class SeguridadPublicaComponent {
  lang: Language;
  constructor(public languageService: LanguageService) {
    this.lang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(l => this.lang = l);
  }
} 