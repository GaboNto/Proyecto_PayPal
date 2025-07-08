import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  pais: string;
  ciudad: string;
  cuentas: {
    saldo: number;
  }[];
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile$: Observable<UserProfile | null> = of(null);
  saldoDisponible: number = 0;
  showChangePassword = false;
  currentPassword = '';
  newPassword = '';
  passwordChangeMessage = '';
  passwordChangeError = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userProfile$ = this.http.get<UserProfile>('/api/users/profile').pipe(
      tap(profile => {
        if (profile && profile.cuentas && profile.cuentas.length > 0) {
          // Asumimos que el saldo a mostrar es el de la primera cuenta
          this.saldoDisponible = profile.cuentas[0].saldo;
        }
      })
    );
  }

  onChangePassword() {
    this.passwordChangeMessage = '';
    this.passwordChangeError = '';
    if (!this.currentPassword || !this.newPassword) {
      this.passwordChangeError = 'Debes completar ambos campos.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.passwordChangeError = 'La nueva contraseña debe tener al menos 6 caracteres.';
      return;
    }
    this.http.post('/api/users/change-password', {
      currentPassword: this.currentPassword,
      newPassword: this.newPassword
    }).subscribe({
      next: (res: any) => {
        this.passwordChangeMessage = res.message || 'Contraseña cambiada exitosamente.';
        this.currentPassword = '';
        this.newPassword = '';
        this.showChangePassword = false;
      },
      error: (err) => {
        this.passwordChangeError = err.error?.message || 'Error al cambiar la contraseña.';
      }
    });
  }
}
