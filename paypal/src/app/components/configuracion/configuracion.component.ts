import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Google2faComponent } from '../security/google-2fa.component';
import { UserService } from '../../services/user.service';
import { LanguageService } from '../../services/language.service';
import { ENDPOINTS } from '../../config/api-config';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, Google2faComponent],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {
  private baseUrl = ENDPOINTS.base;

  configForm: FormGroup;
  user: any = null;
  loading = false;
  successMsg = '';
  errorMsg = '';
  selectedTab = 'personales';
  emailVerificado = false;
  telefonoVerificado = false;
  passwordForm: FormGroup;
  passwordMsg = '';
  passwordError = '';
  recoverEmail: string = '';
  recoverMessage: string = '';
  recoverError: string = '';
  show2FA: boolean = false;
  is2FAVerified: boolean = false;
  emailVerificadoMsg = '';
  emailVerificadoError = '';
  emailVerificadoLoading = false;
  hasBePass = false;
  show2FAQr = false;
  qrData = '';

  // Variables para verificación del código 2FA
  showVerificationForm = false;
  verificationCode = '';
  verificationError = '';
  verificationSuccess = '';
  isVerifying = false;

  bepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
  bepassMsg = '';
  bepassError = '';

  // Variables para preferencias
  preferences = {
    emailNotifications: true,
    pushNotifications: true,
    reportFrequency: 'weekly',
    dailyLimit: '500000',
    deviceVerification: true,
    newsletter: false,
    promotionalEmails: false,
    securityAlerts: true
  };
  preferencesSaved = false;

  // Variables para recuperación de contraseña
  recoverLoading = false;
  recoverCooldown = 0;
  recoverTimer: any;
  Math = Math; // Para usar Math en el template

  // Variables para 2FA
  is2FAAuthenticated = false; // Solo para verificación temporal
  showQR2FA = false;
  qrCode2FA = '';
  secret2FA = '';
  codigo2FA = '';
  showDisable2FAModal = false;
  disable2FAToken = '';
  disable2FAMessage = '';
  disable2FALoading = false;

  // Variables para el flujo de cambio de Be Pass
  showChangeBepassForm = false;
  changeBepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
  changeBepassMsg = '';
  changeBepassError = '';

  // Eliminar: variables, métodos y lógica de configuración regional y preferencias regionales
  // Eliminar: languageOptions, timezoneOptions, currencyOptions, currentLanguage, currentTimezone, currentCurrency, regionalSettingsChanged, currentTime, loadPreferences, savePreferences, onLanguageChange, onTimezoneChange, onCurrencyChange, applyLanguageChange, applyTimezoneChange, applyCurrencyChange, showRegionalChangeMessage, saveRegionalSettings, detectUserTimezone, getCurrentTimeInTimezone y cualquier referencia a preferencias regionales.

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private userService: UserService,
    public languageService: LanguageService
  ) {
    this.configForm = this.fb.group({
      nombre: [{ value: '', disabled: true }, Validators.required],
      apellido: [{ value: '', disabled: true }, Validators.required],
      fecha_nacimiento: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      direccion: [''],
      facturacion: ['']
    });
    this.passwordForm = this.fb.group({
      actual: ['', Validators.required],
      nueva: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', Validators.required]
    }, { validators: this.passwordsMatchValidator });
    this.recoverEmail = '';
  }

  passwordsMatchValidator(form: FormGroup) {
    return form.get('nueva')!.value === form.get('confirmar')!.value ? null : { mismatch: true };
  }

  ngOnInit() {
    this.cargarDatosUsuario();
    this.checkBePassStatus();
    this.check2FAStatus();
    this.loadRecoverCooldown(); // Load cooldown from localStorage
    this.load2FAAuthState(); // Load 2FA auth state from localStorage
    // Eliminar cualquier llamada a loadPreferences o savePreferences, y referencias a currentTime, currentTimezone y regionalSettingsChanged.
  }

  // Cargar estado de autenticación 2FA desde localStorage
  load2FAAuthState() {
    const authState = localStorage.getItem('2fa_auth_state');
    if (authState) {
      const state = JSON.parse(authState);
      const now = Date.now();
      // Verificar si la autenticación no ha expirado (5 minutos)
      if (now - state.timestamp < 5 * 60 * 1000) {
        this.is2FAAuthenticated = true;
      } else {
        // Limpiar estado expirado
        localStorage.removeItem('2fa_auth_state');
      }
    }
  }

  // Guardar estado de autenticación 2FA en localStorage
  save2FAAuthState() {
    const state = {
      timestamp: Date.now()
    };
    localStorage.setItem('2fa_auth_state', JSON.stringify(state));
  }

  // Limpiar estado de autenticación 2FA
  clear2FAAuthState() {
    this.is2FAAuthenticated = false;
    localStorage.removeItem('2fa_auth_state');
  }

  // Método para refrescar el estado cuando se regresa a la página
  onTabChange() {
    this.successMsg = '';
    this.errorMsg = '';
    // Refrescar estado de 2FA cuando se cambia de pestaña
    if (this.selectedTab === 'seguridad') {
      this.check2FAStatus();
    }
  }

  checkBePassStatus() {
    this.userService.hasBepass().subscribe({
      next: (res) => {
        this.hasBePass = res.hasBepass;
      },
      error: () => {
        this.hasBePass = false;
      }
    });
  }
  check2FAStatus() {

    this.http.get<{ isEnabled: boolean, hasBepass: boolean }>(`${this.baseUrl}/users/2fa/status`).subscribe({
      next: (res) => {
        this.is2FAVerified = res.isEnabled;
        this.hasBePass = res.hasBepass;
      },
      error: () => {
        this.is2FAVerified = false;
      }
    });
  }

  loadRecoverCooldown() {
    const savedCooldown = localStorage.getItem('recoverCooldown');
    if (savedCooldown) {
      const cooldownData = JSON.parse(savedCooldown);
      const timePassed = Math.floor((Date.now() - cooldownData.timestamp) / 1000);
      this.recoverCooldown = Math.max(0, cooldownData.duration - timePassed);
      if (this.recoverCooldown > 0) {
        this.startRecoverCooldown();
      }
    }
  }

  saveRecoverCooldown() {
    const cooldownData = {
      duration: this.recoverCooldown,
      timestamp: Date.now()
    };
    localStorage.setItem('recoverCooldown', JSON.stringify(cooldownData));
  }

  startRecoverCooldown() {
    this.saveRecoverCooldown();
    this.recoverTimer = setInterval(() => {
      this.recoverCooldown--;
      this.saveRecoverCooldown();
      if (this.recoverCooldown <= 0) {
        clearInterval(this.recoverTimer);
        this.recoverCooldown = 0;
        localStorage.removeItem('recoverCooldown');
      }
    }, 1000);
  }

  cargarDatosUsuario() {
    this.loading = true;
    this.http.get<any>(`${this.baseUrl}/users/profile`).subscribe({
      next: (data) => {
        this.user = data;
        this.configForm.patchValue({
          nombre: data.nombre,
          apellido: data.apellido,
          fecha_nacimiento: data.fecha_nacimiento,
          email: data.email,
          direccion: data.direccion,
          facturacion: data.facturacion
        });
        this.emailVerificado = data.emailVerificado;
        this.telefonoVerificado = data.telefonoVerificado;
        // Cargar el email para recuperación de contraseña
        this.recoverEmail = data.email || data.correo_electronico || '';
        this.loading = false;
      },
      error: (err) => {
        this.errorMsg = 'No se pudo cargar la información del usuario.';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.configForm.invalid) return;
    this.successMsg = '';
    this.errorMsg = '';
    this.loading = true;
    let data = this.configForm.getRawValue();
    delete data.email; // Siempre eliminar email
    delete data.emailVerificado; // Eliminar este campo también             
    this.http.patch<any>(`${this.baseUrl}/users/profile`, data).subscribe({
      next: (res) => {
        this.successMsg = 'Datos actualizados correctamente.';
        this.loading = false;
        this.cargarDatosUsuario();
        // Limpiar mensaje después de 3 segundos con transición
        setTimeout(() => {
          const alertElement = document.querySelector('.alert-success-float');
          if (alertElement) {
            alertElement.classList.add('fade-out');
            setTimeout(() => {
              this.successMsg = '';
            }, 300);
          } else {
            this.successMsg = '';
          }
        }, 3000);
      },
      error: (err) => {
        this.errorMsg = 'Error al actualizar los datos.';
        this.loading = false;
      }
    });
  }

  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;
    this.passwordMsg = '';
    this.passwordError = '';
    this.http.post<any>(`${this.baseUrl}/users/change-password`, this.passwordForm.value).subscribe({
      next: (res) => {
        this.passwordMsg = 'Contraseña actualizada correctamente.';
        this.passwordForm.reset();
      },
      error: (err) => {
        this.passwordError = err.error.message || 'Error al cambiar la contraseña.';
      }
    });
  }

  onRecoverPasswordSubmit() {
    this.recoverMessage = '';
    this.recoverError = '';

    // Validar que el email esté presente
    if (!this.recoverEmail || !this.recoverEmail.trim()) {
      this.recoverError = 'No se pudo obtener tu correo electrónico.';
      return;
    }

    this.recoverLoading = true;
    this.authService.forgotPassword(this.recoverEmail).subscribe({
      next: (res) => {
        this.recoverMessage = res.message || 'Si el correo es válido, recibirás instrucciones para restablecer tu contraseña.';
        this.recoverLoading = false;
        this.recoverCooldown = 300; // 5 minutos
        this.startRecoverCooldown();
      },
      error: (err) => {
        this.recoverError = err.error?.message || 'Ocurrió un error al enviar el correo.';
        this.recoverLoading = false;
      }
    });
  }

  verificarEmail() {
    this.emailVerificadoLoading = true;
    this.emailVerificadoMsg = '';
    this.emailVerificadoError = '';
    this.authService.sendEmailVerification(this.user.email).subscribe({
      next: (res) => {
        this.emailVerificadoMsg = 'Se ha enviado un correo de verificación a tu dirección de email.';
        this.emailVerificadoLoading = false;
      },
      error: (err) => {
        this.emailVerificadoError = err.error?.message || 'Error al enviar el correo de verificación.';
        this.emailVerificadoLoading = false;
      }
    });
  }

  cambiarPassword() {
    // Implementar lógica de cambio de contraseña
  }

  activar2FA() {
    this.authService.setup2FA().subscribe({
      next: (res) => {
        this.qrData = res.qr;
        this.show2FAQr = true;
      },
      error: (err) => {
        console.error('Error al configurar 2FA:', err);
      }
    });
  }

  verificar2FA() {
    this.authService.verify2FA(this.codigo2FA).subscribe({
      next: (res) => {
        if (res.success) {
          this.is2FAVerified = true;
          this.codigo2FA = '';
          this.showQR2FA = false;
        }
      },
      error: (err) => {
        console.error('Error al verificar 2FA:', err);
      }
    });
  }

  onBepassInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.name === 'newBepass') {
      this.bepassData.newBepass = input.value;
    } else if (input.name === 'confirmBepass') {
      this.bepassData.confirmBepass = input.value;
    } else if (input.name === 'changeNewBepass') {
      this.changeBepassData.newBepass = input.value;
    } else if (input.name === 'changeConfirmBepass') {
      this.changeBepassData.confirmBepass = input.value;
    }
  }

  crearBepass() {
    this.bepassMsg = '';
    this.bepassError = '';
    if (this.bepassData.newBepass !== this.bepassData.confirmBepass) {
      this.bepassError = 'Las claves Be Pass no coinciden.';
      return;
    }
    if (!/^[0-9]{6}$/.test(this.bepassData.newBepass)) {
      this.bepassError = 'La clave Be Pass debe contener exactamente 6 números.';
      return;
    }
    this.userService.setBepass({ ...this.bepassData, isChange: false }).subscribe({
      next: (response) => {
        this.bepassMsg = response.message;
        this.bepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
        this.hasBePass = true; // Actualizar estado inmediatamente

        // Refrescar el estado de Be Pass y 2FA
        this.checkBePassStatus();
        this.check2FAStatus();

        // Mostrar mensaje de éxito y sugerir activar 2FA
        setTimeout(() => {
          this.bepassMsg = '';
        }, 3000);
      },
      error: (err) => {
        this.bepassError = err.error.message || 'Ocurrió un error al crear la clave.';
      }
    });
  }

  close2FAQr() {
    this.show2FAQr = false;
    this.qrData = '';
    // Limpiar variables de verificación
    this.showVerificationForm = false;
    this.verificationCode = '';
    this.verificationError = '';
    this.verificationSuccess = '';
    this.isVerifying = false;
  }

  // Método para mostrar el formulario de verificación
  showVerificationStep() {
    this.showVerificationForm = true;
    this.verificationError = '';
    this.verificationSuccess = '';
  }

  // Método para manejar la entrada del código de verificación
  onVerificationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.verificationCode = input.value;
  }

  // Método para verificar el código y cerrar el modal
  verifyAndClose() {
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.verificationError = 'Por favor ingresa un código de 6 dígitos.';
      return;
    }

    this.isVerifying = true;
    this.verificationError = '';
    this.verificationSuccess = '';

    this.authService.verify2FA(this.verificationCode).subscribe({
      next: (res) => {
        this.isVerifying = false;
        if (res.success) {
          this.verificationSuccess = '¡2FA configurado correctamente!';
          this.is2FAVerified = true;

          // Cerrar modal después de 2 segundos
          setTimeout(() => {
            this.close2FAQr();
          }, 2000);
        } else {
          this.verificationError = 'Código incorrecto. Verifica que hayas escaneado el QR correctamente.';
        }
      },
      error: (err) => {
        this.isVerifying = false;
        this.verificationError = err.error?.message || 'Código incorrecto. Verifica que hayas escaneado el QR correctamente.';
      }
    });
  }

  // Método para requerir verificación 2FA antes de cambiar Be Pass
  require2FAForBePassChange() {
    if (!this.is2FAAuthenticated) {
      this.show2FA = true;
      return false;
    }
    return true;
  }

  // Método para cambiar Be Pass (requiere 2FA)
  cambiarBePass() {
    if (!this.require2FAForBePassChange()) {
      return;
    }
    this.showChangeBepassForm = true;
  }

  // Método para enviar cambio de Be Pass
  onSubmitChangeBePass() {
    this.changeBepassMsg = '';
    this.changeBepassError = '';

    if (this.changeBepassData.newBepass !== this.changeBepassData.confirmBepass) {
      this.changeBepassError = 'Las claves Be Pass no coinciden.';
      return;
    }

    if (!/^[0-9]{6}$/.test(this.changeBepassData.newBepass)) {
      this.changeBepassError = 'La clave Be Pass debe contener exactamente 6 números.';
      return;
    }

    this.userService.setBepass({ ...this.changeBepassData, isChange: true }).subscribe({
      next: (response) => {
        this.changeBepassMsg = response.message;
        this.changeBepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
        this.showChangeBepassForm = false;
      },
      error: (err) => {
        this.changeBepassError = err.error.message || 'Ocurrió un error al cambiar la clave.';
      }
    });
  }

  // Método para cancelar cambio de Be Pass
  cancelarCambioBePass() {
    this.showChangeBepassForm = false;
    this.changeBepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
    this.changeBepassMsg = '';
    this.changeBepassError = '';
  }

  desactivar2FA() {
    if (!this.require2FAForBePassChange()) {
      return;
    }
    this.showDisable2FAModal = true;
    this.disable2FAMessage = '';
  }

  confirmDisable2FA() {
    this.disable2FALoading = true;
    this.http.post<any>(`${this.baseUrl}/users/2fa/disable-request`, {}).subscribe({
      next: (res) => {
        this.disable2FAMessage = '✅ ' + res.message;
        this.disable2FALoading = false;
      },
      error: (err) => {
        this.disable2FAMessage = '❌ ' + (err.error?.message || 'Error al solicitar la desactivación de 2FA');
        this.disable2FALoading = false;
      }
    });
  }

  closeDisable2FAModal() {
    this.showDisable2FAModal = false;
    this.disable2FAMessage = '';
    this.disable2FALoading = false;
  }

  mostrarQR2FA() {
    this.authService.setup2FA().subscribe({
      next: (res) => {
        this.qrData = res.qr;
        this.show2FAQr = true;
      },
      error: (err) => {
        console.error('Error al mostrar QR 2FA:', err);
      }
    });
  }

  on2FAAuthenticated(success: boolean) {
    if (success) {
      this.is2FAAuthenticated = true;
      this.save2FAAuthState();
      this.show2FA = false;
    }
  }

  on2FAVerified(success: boolean) {
    if (success) {
      this.is2FAVerified = true;
    }
  }

  // Eliminar completamente los métodos y referencias a configuración regional y preferencias regionales.
  // Eliminar: languageOptions, timezoneOptions, currencyOptions, currentLanguage, currentTimezone, currentCurrency, regionalSettingsChanged, currentTime, loadPreferences, savePreferences, onLanguageChange, onTimezoneChange, onCurrencyChange, applyLanguageChange, applyTimezoneChange, applyCurrencyChange, showRegionalChangeMessage, saveRegionalSettings, detectUserTimezone, getCurrentTimeInTimezone y cualquier referencia a preferencias regionales.

  // Mostrar mensaje de cambio regional
  showRegionalChangeMessage(message: string) {
    // Crear un toast o notificación temporal
    const toast = document.createElement('div');
    toast.className = 'regional-change-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 10000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(toast);

    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Guardar configuración regional
  saveRegionalSettings() {
    // Eliminar cualquier llamada a loadPreferences o savePreferences, y referencias a currentTime, currentTimezone y regionalSettingsChanged.
    this.showRegionalChangeMessage('Configuración regional guardada correctamente');
  }

  // Detectar zona horaria automáticamente
  detectUserTimezone(): string {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return timezone;
    } catch (error) {
      return 'America/Santiago'; // Fallback a Chile
    }
  }

  // Obtener hora actual en la zona horaria seleccionada
  getCurrentTimeInTimezone(timezone: string): string {
    try {
      if (timezone === 'auto') {
        timezone = this.detectUserTimezone();
      }

      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: timezone,
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };

      return new Intl.DateTimeFormat('es-CL', options).format(now);
    } catch (error) {
      return new Date().toLocaleTimeString('es-CL');
    }
  }

  showActiveSessions() {
    // Implementar modal para mostrar sesiones activas
    alert('Funcionalidad de sesiones activas próximamente...');
  }
}
