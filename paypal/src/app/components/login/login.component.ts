/**
 * Componente de inicio de sesión (`LoginComponent`).
 * Permite a los usuarios autenticarse ingresando su correo electrónico y contraseña.
 * Si las credenciales son válidas, se guarda el token de acceso y se redirige al perfil.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    /**
   * Campo de entrada para el correo electrónico (utilizado solo en caso de binding directo).
   */
  email = '';
  
  /**
   * Campo de entrada para la contraseña (utilizado solo en caso de binding directo).
   */
  password = '';
    /**
   * Mensaje de error si la autenticación falla.
   */
  error: string | null = null;
    /**
   * Formulario reactivo que contiene los campos de login.
   */
  loginForm: FormGroup;


    /**
   * Constructor que inyecta dependencias necesarias.
   * @param http Cliente HTTP para enviar la solicitud de login.
   * @param router Permite redireccionar al perfil tras el login.
   * @param authService Servicio para gestionar la autenticación.
   */
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  isLoading = false; // Declara esta propiedad en tu componente

  /**
   * Maneja el envío del formulario de inicio de sesión.
   * Verifica si el formulario es válido, envía la solicitud y gestiona la respuesta.
   */
  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      this.http.post<{ accessToken: string }>('http://localhost:3000/api/auth/login', this.loginForm.value)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            if (response && response.accessToken) {
              this.authService.login(response.accessToken);
              this.router.navigate(['/profile']);
            } else {
              this.error = 'No se recibió el token de acceso';
            }
          },
          error: (err) => {
            this.isLoading = false;
            this.error = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
            console.error('Error de autenticación:', err);
          }
        });
    }
  }


}
