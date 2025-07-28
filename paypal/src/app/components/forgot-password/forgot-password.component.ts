import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http'; // Importa HttpErrorResponse

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm: FormGroup;
  submitted = false;
  message = '';
  error = '';
  showSuccess = false;
  isLoading = false; // Nueva propiedad para el estado de carga

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.showSuccess = false;
    this.message = '';
    this.error = '';
    this.submitted = false;
    this.isLoading = false; // Asegura que el estado de carga sea falso al inicializar
    this.forgotForm.reset();
  }

  // Getter para acceder fácilmente a los controles del formulario en el HTML
  get f() { return this.forgotForm.controls; }

  async onSubmit() {
    this.submitted = true;
    this.message = '';
    this.error = '';
    this.showSuccess = false;

    // Detener aquí si el formulario es inválido
    if (this.forgotForm.invalid) {
      return;
    }

    this.isLoading = true; // Inicia el estado de carga

    // Obtener el valor del email del formulario y asegurar que es un string
    const emailToRecover: string = this.forgotForm.value.email;
    console.log(typeof (emailToRecover))

    try {
      // Llama al servicio de autenticación para solicitar el restablecimiento de contraseña
      await this.authService.sendPasswordResetEmailDirect({ to: emailToRecover }).toPromise();

      this.showSuccess = true;
      this.message = 'Si la dirección de correo electrónico está registrada, recibirás un enlace para restablecer tu contraseña.';
      this.forgotForm.reset(); // Limpia el formulario después de un envío exitoso
    } catch (err) {
      this.showSuccess = false; // Asegúrate de que el mensaje de éxito no se muestre en caso de error
      if (err instanceof HttpErrorResponse) {
        // Muestra el mensaje de error del backend si está disponible, de lo contrario, un mensaje genérico
        this.error = err.error?.message || 'Error al solicitar recuperación de contraseña. Por favor, inténtalo de nuevo.';
      } else {
        this.error = 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.';
      }
      console.error('Error en onSubmit de ForgotPassword:', err);
    } finally {
      this.isLoading = false; // Finaliza el estado de carga, independientemente del resultado
    }
  }
}
