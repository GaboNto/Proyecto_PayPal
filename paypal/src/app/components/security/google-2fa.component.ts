import { Component, EventEmitter, Output, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-google-2fa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="twofa-container">
      <div class="security-notice" *ngIf="showSecurityNotice">
        <div class="notice-icon">🔒</div>
        <div class="notice-text">
          <strong>Verificación de seguridad activa</strong><br>
          <small>Esta ventana permanecerá verificada por 3 minutos</small>
        </div>
        <div class="timer" *ngIf="timeRemaining > 0">
          {{ formatTime(timeRemaining) }}
        </div>
      </div>
      
      <form (ngSubmit)="onSubmit()" #form2fa="ngForm" *ngIf="!isVerified || timeRemaining === 0">
        <div class="form-group">
          <label for="code2fa">Código 2FA</label>
          <input type="text" id="code2fa" name="code2fa" class="form-control" maxlength="6" minlength="6"
                 [(ngModel)]="code" required pattern="[0-9]{6}" inputmode="numeric" (input)="onInput($event)"
                 [disabled]="isLoading">
          <small class="form-text text-muted">Ingresa el código de 6 dígitos de Google Authenticator.</small>
        </div>
        <div *ngIf="error" class="alert alert-danger mt-2">{{ error }}</div>
        <button type="submit" class="btn btn-success mt-3" [disabled]="!form2fa.form.valid || isLoading">
          <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2"></span>
          {{ isLoading ? 'Verificando...' : 'Verificar' }}
        </button>
      </form>
      
      <div *ngIf="isVerified && timeRemaining > 0" class="verified-status">
        <div class="status-icon">✅</div>
        <div class="status-text">
          <strong>Verificación exitosa</strong><br>
          <small>Tiempo restante: {{ formatTime(timeRemaining) }}</small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .twofa-container {
      position: relative;
    }
    
    .security-notice {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 10px rgba(40, 167, 69, 0.3);
    }
    
    .notice-icon {
      font-size: 24px;
    }
    
    .notice-text {
      flex: 1;
    }
    
    .notice-text strong {
      font-size: 16px;
    }
    
    .notice-text small {
      opacity: 0.9;
    }
    
    .timer {
      background: rgba(255, 255, 255, 0.2);
      padding: 8px 12px;
      border-radius: 6px;
      font-weight: bold;
      font-size: 14px;
      min-width: 60px;
      text-align: center;
    }
    
    .verified-status {
      background: linear-gradient(135deg, #28a745, #20c997);
      color: white;
      padding: 20px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 15px;
      box-shadow: 0 2px 10px rgba(40, 167, 69, 0.3);
    }
    
    .status-icon {
      font-size: 32px;
    }
    
    .status-text {
      flex: 1;
    }
    
    .status-text strong {
      font-size: 18px;
    }
    
    .status-text small {
      opacity: 0.9;
    }
    
    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class Google2faComponent implements OnInit, OnDestroy {
  @Output() verified = new EventEmitter<boolean>();
  code: string = '';
  error: string = '';
  isLoading = false;
  isVerified = false;
  timeRemaining = 0;
  showSecurityNotice = false;
  private authService = inject(AuthService);
  private timer: any;
  private lastActivity = Date.now();
  private readonly VERIFICATION_DURATION = 3 * 60 * 1000; // 3 minutos en milisegundos

  ngOnInit() {
    this.startActivityMonitoring();
  }

  ngOnDestroy() {
    this.clearTimer();
    this.stopActivityMonitoring();
  }

  @HostListener('window:focus')
  onWindowFocus() {
    this.checkActivityTimeout();
  }

  @HostListener('window:blur')
  onWindowBlur() {
    this.lastActivity = Date.now();
  }

  @HostListener('document:visibilitychange')
  onVisibilityChange() {
    if (document.hidden) {
      this.lastActivity = Date.now();
    } else {
      this.checkActivityTimeout();
    }
  }

  private startActivityMonitoring() {
    // Verificar cada segundo si el usuario ha estado inactivo
    setInterval(() => {
      this.checkActivityTimeout();
    }, 1000);
  }

  private stopActivityMonitoring() {
    // Cleanup se maneja en ngOnDestroy
  }

  private checkActivityTimeout() {
    if (this.isVerified && this.timeRemaining > 0) {
      const timeSinceLastActivity = Date.now() - this.lastActivity;
      const maxInactivityTime = 30 * 1000; // 30 segundos de inactividad

      if (timeSinceLastActivity > maxInactivityTime) {
        this.resetVerification();
      }
    }
  }

  private resetVerification() {
    this.isVerified = false;
    this.timeRemaining = 0;
    this.showSecurityNotice = false;
    this.verified.emit(false);
    this.clearTimer();
  }

  private startVerificationTimer() {
    this.timeRemaining = this.VERIFICATION_DURATION;
    this.showSecurityNotice = true;
    
    this.timer = setInterval(() => {
      this.timeRemaining -= 1000;
      
      if (this.timeRemaining <= 0) {
        this.resetVerification();
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  formatTime(milliseconds: number): string {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.code = input.value;
    this.lastActivity = Date.now();
  }

  onSubmit() {
    this.error = '';
    this.isLoading = true;
    this.lastActivity = Date.now();

    this.authService.verify2FA(this.code).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success) {
          this.isVerified = true;
          this.startVerificationTimer();
          this.verified.emit(true);
        } else {
          this.error = 'Código incorrecto. Intenta nuevamente.';
          this.verified.emit(false);
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.error = err.error?.message || 'Código incorrecto. Intenta nuevamente.';
        this.verified.emit(false);
      }
    });
  }
} 