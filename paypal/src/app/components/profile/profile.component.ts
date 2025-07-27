/**
 * Componente que muestra el perfil del usuario autenticado.
 * Recupera la información del usuario desde el backend y muestra el saldo disponible.
 * Utiliza programación reactiva con `Observable` para manejar la respuesta del perfil.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';


/**
 * Interfaz que define la estructura del perfil de usuario recibido desde el backend.
 */
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
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
   /**
   * Observable que contiene los datos del perfil del usuario.
   */
  userProfile$: Observable<UserProfile | null> = of(null);
    /**
   * Saldo disponible de la cuenta principal del usuario.
   */
  saldoDisponible: number = 0;
  /**
   * Inyecta el servicio HttpClient para realizar la solicitud HTTP al backend.
   * @param http Cliente HTTP para obtener el perfil de usuario.
   */
  constructor(private http: HttpClient) {}

  /**
   * Al inicializar el componente, realiza una petición al backend
   * para obtener los datos del usuario y calcula el saldo disponible.
   */
  ngOnInit(): void {
    this.userProfile$ = this.http.get<UserProfile>('http://localhost:3000/api/users/profile').pipe(
      tap(profile => {
        if (profile && profile.cuentas && profile.cuentas.length > 0) {
          // Asumimos que el saldo a mostrar es el de la primera cuenta
          this.saldoDisponible = profile.cuentas[0].saldo;
        }
      })
    );
  }
}
