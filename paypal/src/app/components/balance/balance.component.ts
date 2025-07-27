/**
 * Componente que representa el balance del usuario.
 * Permite visualizar metas financieras y transacciones de forma opcional.
 * Utiliza `FinancialGoalsComponent` como componente hijo.
 */
import { Component } from '@angular/core';
import { FinancialGoalsComponent } from '../financial-goals/financial-goals.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, FinancialGoalsComponent],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {
   /**
   * Indica si las metas financieras están visibles o no.
   */
  showFinancialGoals = false;
   /**
   * Indica si la sección de transacciones está visible o no.
   */
  showTransactions = false;

    /**
   * Alterna la visibilidad de las metas financieras.
   */
  toggleFinancialGoals() {
    this.showFinancialGoals = !this.showFinancialGoals;
  }

  /**
   * Alterna la visibilidad de las transacciones.
   */
  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }
}
