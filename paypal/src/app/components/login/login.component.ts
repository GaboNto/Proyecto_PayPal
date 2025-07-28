import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ENDPOINTS } from '../../config/api-config';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  error: string | null = null;
  loginForm: FormGroup;
  isLoading = false;
  private baseUrl = ENDPOINTS.base;  // 👈 Declaración fuera del constructor

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

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;
      
      const loginData = this.loginForm.value;
      console.log('Login - Datos enviados:', { email: loginData.email, password: '***' });
      console.log('Login - URL:', `${this.baseUrl}/auth/login`);
      
      this.http.post<{ accessToken: string }>(`${this.baseUrl}/auth/login`, loginData)
        .subscribe({
          next: (response) => {
            this.isLoading = false;
            console.log('Login - Respuesta exitosa:', response);
            if (response?.accessToken) {
              this.authService.login(response.accessToken);
              this.router.navigate(['/profile']);
            } else {
              this.error = 'No se recibió el token de acceso.';
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.error('Login - Error completo:', err);
            this.error = 'Credenciales incorrectas. Por favor, verifica tu email y contraseña.';
            console.error('Error de autenticación:', err);
          }
        });
    }
  }
}
