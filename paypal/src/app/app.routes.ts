import { Routes } from '@angular/router';
import { BalanceComponent } from './components/balance/balance.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { FinancialGoalsComponent } from './components/financial-goals/financial-goals.component';
import { HomeComponent } from './components/home/home.component';
import { PayComponent } from './components/pay.component';
<<<<<<< HEAD
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
=======
>>>>>>> 9704d2405075eb921529f527840ffc6b190e9d77

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'balance', component: BalanceComponent },
  { path: 'transactions', component: TransactionsComponent },
  { path: 'financial-goals', component: FinancialGoalsComponent },
<<<<<<< HEAD
  { path: 'pay', component: PayComponent },
  { path: 'tarjetas', component: TarjetasComponent }
=======
  { path: 'pay', component: PayComponent }
>>>>>>> 9704d2405075eb921529f527840ffc6b190e9d77
];
