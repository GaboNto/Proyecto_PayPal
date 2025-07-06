import { Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { FinancialGoalsComponent } from './components/financial-goals/financial-goals.component';
import { HomeComponent } from './components/home/home.component';
import { PayComponent } from './components/pay.component';
import { TarjetasComponent } from './components/tarjetas/tarjetas.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SecurityComponent } from './components/security/security.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { DondeComprarComponent } from './components/donde-comprar/donde-comprar.component';
import { SeguridadPublicaComponent } from './components/seguridad-publica/seguridad-publica.component';
import { TarjetasPublicaComponent } from './components/tarjetas/tarjetas-publica.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard] },
  { path: 'financial-goals', component: FinancialGoalsComponent },
  { path: 'pay', component: PayComponent },
  { path: 'tarjetas', component: TarjetasComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'security', component: SecurityComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: 'donde-comprar', component: DondeComprarComponent },
  { path: 'seguridad-publica', component: SeguridadPublicaComponent },
  { path: 'tarjetas-publica', component: TarjetasPublicaComponent }
];

export const appImports = [
  ReactiveFormsModule
];
