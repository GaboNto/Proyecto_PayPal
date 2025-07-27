/**
 * Componente para solicitar la recuperación de contraseña.
 * Muestra un formulario donde el usuario puede ingresar su correo electrónico
 * y recibir un enlace de recuperación si la cuenta existe.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
    /**
   * Formulario reactivo que contiene el campo de correo electrónico.
   */
  forgotForm: FormGroup;
   /**
   * Indica si el formulario ha sido enviado.
   */
  submitted = false;
   /**
   * Mensaje de éxito que se muestra tras una solicitud válida.
   */
  message = '';
    /**
   * Mensaje de error si ocurre algún problema durante la solicitud.
   */
  error = '';
   /**
   * Bandera para mostrar el mensaje de éxito.
   */
  showSuccess = false;

    /**
   * Constructor que inyecta `FormBuilder` para crear el formulario
   * y `AuthService` para realizar la solicitud de recuperación.
   * @param fb FormBuilder para inicializar el formulario.
   * @param authService Servicio de autenticación.
   */
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Inicializa el componente limpiando el formulario y reseteando estados.
   */
  ngOnInit() {
    this.showSuccess = false;
    this.message = '';
    this.error = '';
    this.submitted = false;
    this.forgotForm.reset();
  }
  /**
   * Envía el formulario de recuperación.
   * Si el correo es válido, se realiza una solicitud al backend.
   * Se maneja la respuesta o posibles errores.
   */
  async onSubmit() {
    this.submitted = true;
    this.message = '';
    this.error = '';
    this.showSuccess = false;
    if (this.forgotForm.invalid) return;
    try {
      const res = await this.authService.forgotPassword(this.forgotForm.value.email).toPromise();
      this.message = res.message || 'Revisa tu bandeja de entrada. Si la cuenta existe, te llegará un enlace de recuperación.';
      this.showSuccess = true;
      this.forgotForm.reset();
    } catch (err: any) {
      this.error = err.error?.message || 'Error al solicitar recuperación.';
    }
  }
}
