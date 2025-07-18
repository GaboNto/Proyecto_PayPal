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
  email = '';
  password = '';
  error: string | null = null;
  loginForm: FormGroup;

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
