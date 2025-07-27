/**
 * Componente que muestra información pública sobre las medidas de seguridad de la plataforma.
 *
 * Este componente está orientado a usuarios que aún no están registrados, presentando detalles
 * sobre cifrado, protección contra fraudes, autenticación en dos pasos y recomendaciones de seguridad.
 *
 * También incluye enlaces útiles hacia recursos oficiales de PayPal relacionados con la seguridad.
 *
 * Contenido visual renderizado directamente mediante plantilla embebida (`template`) en lugar de usar un archivo HTML separado.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seguridad-publica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seguridad-publica-container">
      <h1>Seguridad en PayPal</h1>
      <p class="subtitle">Tu seguridad es nuestra prioridad. Descubre cómo protegemos tus datos y transacciones, incluso antes de que te registres.</p>
      <ul class="seguridad-list">
        <li>🔒 Pagos cifrados de extremo a extremo</li>
        <li>🛡️ Protección contra fraudes y suplantación</li>
        <li>👀 Nunca compartimos tus datos bancarios con los comercios</li>
        <li>💬 Soporte 24/7 para cualquier consulta de seguridad</li>
        <li>🔔 Alertas y notificaciones de actividad sospechosa</li>
      </ul>
      <div class="extra-seguridad">
        <h2>Protección al Comprador</h2>
        <p>Si tu compra no llega o no es lo que esperabas, puedes solicitar un reembolso fácilmente. PayPal te respalda en cada transacción.</p>
        <h2>Autenticación en Dos Pasos (2FA)</h2>
        <p>Ofrecemos autenticación 2FA para que solo tú puedas acceder a tu cuenta, incluso si alguien más conoce tu contraseña.</p>
        <h2>Consejos para tu seguridad</h2>
        <ul class="consejos-list">
          <li>Utiliza contraseñas seguras y cámbialas periódicamente</li>
          <li>No compartas tus datos de acceso con nadie</li>
          <li>Verifica siempre la URL antes de ingresar tus credenciales</li>
          <li>Activa las notificaciones para estar al tanto de cualquier movimiento</li>
        </ul>
        <div class="enlaces-utiles">
          <h3>Enlaces útiles</h3>
          <ul>
            <li><a href="https://www.paypal.com/es/webapps/mpp/paypal-safety-and-security" target="_blank">Más sobre seguridad en PayPal</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ1982" target="_blank">¿Cómo me protege PayPal?</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ2254" target="_blank">Consejos para evitar fraudes</a></li>
          </ul>
        </div>
      </div>
      <div class="cta">
        <a routerLink="/register" class="btn btn-primary">Crea tu cuenta y compra seguro</a>
      </div>
    </div>
  `,
  styleUrls: ['./seguridad-publica.component.css']
})
export class SeguridadPublicaComponent {} 