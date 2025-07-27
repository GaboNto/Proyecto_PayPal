/**
 * Componente que permite al usuario restablecer su contraseña mediante un token recibido por correo.
 * Incluye validación de campos y lógica de coincidencia de contraseñas.
 */
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
    /**
   * Formulario reactivo de restablecimiento de contraseña.
   */
  resetForm: FormGroup;
  submitted = false;
  message = '';
  error = '';
  token = '';
  /**
   * Constructor que inyecta servicios necesarios para el componente.
   * - Recupera el token desde la query param `?token=`.
   * @param fb FormBuilder para construir el formulario reactivo.
   * @param route ActivatedRoute para acceder a parámetros de la ruta.
   * @param router Router para redireccionar al login tras el éxito.
   * @param authService Servicio de autenticación para manejar el restablecimiento.
   */
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });
  }
  /**
   * Validador personalizado para asegurar que ambas contraseñas coincidan.
   * @param form FormGroup con campos `newPassword` y `confirmPassword`.
   * @returns `null` si coinciden, objeto con error si no.
   */
  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }
  /**
   * Envia la nueva contraseña al backend para restablecerla.
   * Si tiene éxito, muestra mensaje y redirige al login.
   * Si falla, muestra mensaje de error.
   */
  async onSubmit() {
    this.submitted = true;
    this.message = '';
    this.error = '';
    if (this.resetForm.invalid || !this.token) return;
    try {
      const res = await this.authService.resetPassword(this.token, this.resetForm.value.newPassword).toPromise();
      this.message = res.message || 'Contraseña restablecida correctamente.';
      setTimeout(() => this.router.navigate(['/login']), 2000);
    } catch (err: any) {
      this.error = err.error?.message || 'Error al restablecer la contraseña.';
    }
  }
}
