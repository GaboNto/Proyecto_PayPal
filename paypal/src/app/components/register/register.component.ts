import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ciudad: '',
    pais: '',
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post('http://localhost:3000/api/auth/register', this.user)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Error en el registro', error);
          alert('Hubo un error durante el registro. Por favor, inténtalo de nuevo.');
        }
      });
  }
} 