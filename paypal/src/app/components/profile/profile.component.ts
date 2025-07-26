import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, take } from 'rxjs';
import { CuentasService, Cuenta } from '../../services/cuentas.service';
import { RouterModule } from '@angular/router';
import { TransferService } from '../../services/transfer.service';
import { FormsModule } from '@angular/forms';
import { ENDPOINTS } from '../../config/api-config';

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  pais: string;
  ciudad: string;
  rut: string; // <-- Agregado para mostrar el RUT
  cuentas: { saldo: number, tipo_cuenta: string }[];

}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile$: Observable<UserProfile | null> = of(null);
  user: UserProfile | null = null;
  private baseUrl = ENDPOINTS.base;  // 👈 Declaración fuera del constructor

  saldoDisponible: number = 0;
  saldoDisponibleAhorro: number = 0;
  currentYear = new Date().getFullYear();
  isEditing: boolean = false;

  cuentas: Cuenta[] = [];
  movimientos: any[] = [];

  constructor(
    private http: HttpClient,
    private cuentasService: CuentasService,
    private transferService: TransferService
  ) { }

  ngOnInit(): void {
    this.userProfile$ = this.http.get<UserProfile>(`${this.baseUrl}/users/profile`).pipe(
      tap(profile => {
        if (profile?.cuentas?.length) {
          const cuentaVista = profile.cuentas.find(cuenta => cuenta.tipo_cuenta === 'Cuenta Vista');
          const cuentaAhorro = profile.cuentas.find(cuenta => cuenta.tipo_cuenta === 'Cuenta de Ahorro');
          this.saldoDisponible = cuentaVista?.saldo ?? 0
          this.saldoDisponibleAhorro = cuentaAhorro?.saldo ?? 0
        }
        this.user = profile;
      })
    );

    this.cuentasService.getCuentas().subscribe(cuentas => {
      this.cuentas = cuentas;
    });

    this.transferService.getHistory().subscribe(movimientos => {
      this.movimientos = movimientos;
    });
  }
  guardarCambios() {
    if (!this.user) return;

    this.http.put(`${this.baseUrl}/users/${this.user.id_usuario}`, this.user).subscribe({
      next: () => {
        this.isEditing = false;
        alert('Perfil actualizado con éxito');
      },
      error: (error) => {
        console.error('Error al actualizar perfil:', error);
        alert('Ocurrió un error al guardar los cambios.');
      }
    });
  }
}
