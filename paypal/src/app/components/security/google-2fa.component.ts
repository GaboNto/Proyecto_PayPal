import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { inject } from '@angular/core';

@Component({
  selector: 'app-google-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <form (ngSubmit)="onSubmit()" #form2fa="ngForm">
      <div class="form-group">
        <label for="code2fa">{{ 'security.twoFactorCode' | translate }}</label>
        <input type="text" id="code2fa" name="code2fa" class="form-control" maxlength="6" minlength="6"
               [(ngModel)]="code" required pattern="[0-9]{6}" inputmode="numeric" (input)="onInput($event)">
        <small class="form-text text-muted">{{ 'security.enter6DigitCode' | translate }}</small>
      </div>
      <div *ngIf="error" class="alert alert-danger mt-2">{{ error }}</div>
      <button type="submit" class="btn btn-success mt-3" [disabled]="!form2fa.form.valid">{{ 'security.verify' | translate }}</button>
    </form>
  `
})
export class Google2faComponent {
  @Output() verified = new EventEmitter<boolean>();
  code: string = '';
  error: string = '';
  private authService = inject(AuthService);

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.code = input.value;
  }

  onSubmit() {
    this.error = '';
    this.authService.verify2FA(this.code).subscribe({
      next: (res) => {
        if (res.success) {
          this.verified.emit(true);
        } else {
          this.error = 'Código incorrecto. Intenta nuevamente.';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Código incorrecto. Intenta nuevamente.';
      }
    });
  }
} 