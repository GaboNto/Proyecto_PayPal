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
  resetForm: FormGroup;
  submitted = false;
  message = '';
  error = '';
  token = '';

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

  passwordsMatchValidator(form: FormGroup) {
    return form.get('newPassword')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

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
