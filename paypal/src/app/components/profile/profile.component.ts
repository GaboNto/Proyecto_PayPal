import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap, take } from 'rxjs';
import { CuentasService, Cuenta } from '../../services/cuentas.service';
import { RouterModule } from '@angular/router';
import { TransferService } from '../../services/transfer.service';
import { FormsModule } from '@angular/forms';

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  pais: string;
  ciudad: string;
  rut: string; // <-- Agregado para mostrar el RUT
  cuentas: { saldo: number }[];
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

  saldoDisponible: number = 0;
  currentYear = new Date().getFullYear();
  isEditing: boolean = false;

  cuentas: Cuenta[] = [];
  movimientos: any[] = [];

  constructor(
    private http: HttpClient,
    private cuentasService: CuentasService,
    private transferService: TransferService
  ) {}

  ngOnInit(): void {
    this.userProfile$ = this.http.get<UserProfile>('http://localhost:3000/api/users/profile').pipe(
      tap(profile => {
        if (profile?.cuentas?.length) {
          this.saldoDisponible = profile.cuentas[0].saldo;
        }
        this.user = profile; // Guardamos el perfil directamente
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

    this.http.put(`http://localhost:3000/api/users/${this.user.id_usuario}`, this.user).subscribe({
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
