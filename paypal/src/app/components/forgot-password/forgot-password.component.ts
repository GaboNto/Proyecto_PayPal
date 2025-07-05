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
  forgotForm: FormGroup;
  submitted = false;
  message = '';
  error = '';
  showSuccess = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit() {
    this.showSuccess = false;
    this.message = '';
    this.error = '';
    this.submitted = false;
    this.forgotForm.reset();
  }

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
