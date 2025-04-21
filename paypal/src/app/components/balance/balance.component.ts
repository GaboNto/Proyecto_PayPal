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

}
