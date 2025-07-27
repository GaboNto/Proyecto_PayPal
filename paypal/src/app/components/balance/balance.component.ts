import { Component } from '@angular/core';
import { FinancialGoalsComponent } from '../financial-goals/financial-goals.component';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, FinancialGoalsComponent, TranslateModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.scss'
})
export class BalanceComponent {
  showFinancialGoals = false;
  showTransactions = false;

  toggleFinancialGoals() {
    this.showFinancialGoals = !this.showFinancialGoals;
  }

  toggleTransactions() {
    this.showTransactions = !this.showTransactions;
  }
}
