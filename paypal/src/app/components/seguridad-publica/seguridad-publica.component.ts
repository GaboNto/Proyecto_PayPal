import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-seguridad-publica',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="seguridad-publica-container">
      <h1>{{ 'publicSecurity.title' | translate }}</h1>
      <p class="subtitle">{{ 'publicSecurity.subtitle' | translate }}</p>
      <ul class="seguridad-list">
        <li>🔒 {{ 'publicSecurity.endToEndEncryption' | translate }}</li>
        <li>🛡️ {{ 'publicSecurity.fraudProtection' | translate }}</li>
        <li>👀 {{ 'publicSecurity.neverShareData' | translate }}</li>
        <li>💬 {{ 'publicSecurity.support247' | translate }}</li>
        <li>🔔 {{ 'publicSecurity.suspiciousActivityAlerts' | translate }}</li>
      </ul>
      <div class="extra-seguridad">
        <h2>{{ 'publicSecurity.buyerProtection' | translate }}</h2>
        <p>{{ 'publicSecurity.buyerProtectionDesc' | translate }}</p>
        <h2>{{ 'publicSecurity.twoFactorAuth' | translate }}</h2>
        <p>{{ 'publicSecurity.twoFactorAuthDesc' | translate }}</p>
        <h2>{{ 'publicSecurity.securityTips' | translate }}</h2>
        <ul class="consejos-list">
          <li>{{ 'publicSecurity.useStrongPasswords' | translate }}</li>
          <li>{{ 'publicSecurity.dontShareAccessData' | translate }}</li>
          <li>{{ 'publicSecurity.verifyUrl' | translate }}</li>
          <li>{{ 'publicSecurity.activateNotifications' | translate }}</li>
        </ul>
        <div class="enlaces-utiles">
          <h3>{{ 'publicSecurity.usefulLinks' | translate }}</h3>
          <ul>
            <li><a href="https://www.paypal.com/es/webapps/mpp/paypal-safety-and-security" target="_blank">{{ 'publicSecurity.moreAboutSecurity' | translate }}</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ1982" target="_blank">{{ 'publicSecurity.howDoesPayPalProtect' | translate }}</a></li>
            <li><a href="https://www.paypal.com/es/smarthelp/article/FAQ2254" target="_blank">{{ 'publicSecurity.fraudPreventionTips' | translate }}</a></li>
          </ul>
        </div>
      </div>
      <div class="cta">
        <a routerLink="/register" class="btn btn-primary">{{ 'publicSecurity.createAccountAndShopSafe' | translate }}</a>
      </div>
    </div>
  `,
  styleUrls: ['./seguridad-publica.component.css']
})
export class SeguridadPublicaComponent {} 