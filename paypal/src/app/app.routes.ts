import { Routes } from '@angular/router';
import { ConfiguracionComponent } from './components/configuracion/configuracion.component';
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
import { VentajasComponent } from './components/ventajas/ventajas.component';
import { authGuard } from './auth.guard';
import { MovimientosComponent } from './components/movimientos/movimientos.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyEmailComponent } from './components/verify-email.component';
import { VerifyDisable2faComponent } from './components/verify-disable-2fa.component';
import { PreRegistroComponent } from './components/pre-registro/pre-registro.component';
import { RedirectIfAuthGuard } from './guards/redirect-if-auth.guard';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'transactions', component: TransactionsComponent, canActivate: [authGuard] },
  { path: 'financial-goals', component: FinancialGoalsComponent, canActivate: [authGuard] },
  { path: 'pay', component: PayComponent, canActivate: [authGuard] },
  { path: 'tarjetas', component: TarjetasComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent, canActivate: [RedirectIfAuthGuard] },
  { path: 'pre-registro', component: PreRegistroComponent },
  { path: 'register', component: RegisterComponent, canActivate: [RedirectIfAuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'security', component: SecurityComponent, canActivate: [authGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent, canActivate: [authGuard] },
  { path: 'donde-comprar', component: DondeComprarComponent },
  { path: 'seguridad-publica', component: SeguridadPublicaComponent },

  { path: 'tarjetas-publica', component: TarjetasPublicaComponent },
  { path: 'movimientos', component: MovimientosComponent, canActivate: [authGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'configuracion', component: ConfiguracionComponent, canActivate: [authGuard] },
  { path: 'verify-email', component: VerifyEmailComponent, canActivate: [authGuard] },
  { path: 'verify-disable-2fa', component: VerifyDisable2faComponent, canActivate: [authGuard] },
  { path: 'ventajas', component: VentajasComponent }
];

export const appImports = [
  ReactiveFormsModule
];
