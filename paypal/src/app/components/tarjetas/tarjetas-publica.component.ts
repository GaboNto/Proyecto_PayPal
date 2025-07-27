import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tarjetas-publica',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <div class="tarjetas-publica-container">
      <h1>{{ 'publicCards.title' | translate }}</h1>
      <p class="subtitle">{{ 'publicCards.subtitle' | translate }}</p>
      <div class="tarjetas-tipos">
        <div class="tarjeta-info virtual">
          <h2>💳 {{ 'publicCards.virtualCard' | translate }}</h2>
          <ul>
            <li>{{ 'publicCards.idealForOnline' | translate }}</li>
            <li>{{ 'publicCards.generatedInstantly' | translate }}</li>
            <li>{{ 'publicCards.greaterSecurity' | translate }}</li>
            <li>{{ 'publicCards.noPhysicalShipping' | translate }}</li>
          </ul>
        </div>
        <div class="tarjeta-info fisica">
          <h2>🏦 {{ 'publicCards.physicalCard' | translate }}</h2>
          <ul>
            <li>{{ 'publicCards.perfectForPhysicalStores' | translate }}</li>
            <li>{{ 'publicCards.homeDelivery' | translate }}</li>
            <li>{{ 'publicCards.contactlessCompatible' | translate }}</li>
            <li>{{ 'publicCards.internationalSupport' | translate }}</li>
          </ul>
        </div>
      </div>
      <div class="ventajas">
        <h2>{{ 'publicCards.cardAdvantages' | translate }}</h2>
        <ul>
          <li>{{ 'publicCards.100PercentOnline' | translate }}</li>
          <li>{{ 'publicCards.instantBlockUnblock' | translate }}</li>
          <li>{{ 'publicCards.realTimeNotifications' | translate }}</li>
          <li>{{ 'publicCards.noHiddenCosts' | translate }}</li>
        </ul>
      </div>
      <div class="cta">
        <a routerLink="/register" class="btn btn-primary">{{ 'publicCards.requestCardByRegistering' | translate }}</a>
      </div>
    </div>
  `,
  styleUrls: ['./tarjetas-publica.component.css']
})
export class TarjetasPublicaComponent {} 