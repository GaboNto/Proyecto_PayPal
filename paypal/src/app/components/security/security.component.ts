/**
 * Componente encargado de la gestión de seguridad del usuario.
 * Permite establecer o cambiar la clave secundaria Be Pass,
 * gestionar la autenticación en dos pasos (2FA) con Google Authenticator
 * y enviar correos de recuperación de contraseña.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Google2faComponent } from './google-2fa.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule, Google2faComponent],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent implements OnInit {
   /**
   * Datos del formulario para crear clave Be Pass.
   */
  bepassData = {
    newBepass: '',
    confirmBepass: '',
    currentPassword: ''
  };

  message: string = '';
  error: string = '';

  hasBePass: boolean = false;
  is2FAVerified: boolean = false;

  show2FAQr: boolean = false;
  qrData: string = '';

  changeBepassData = {
    newBepass: '',
    confirmBepass: '',
    currentPassword: ''
  };
  changeMessage: string = '';
  changeError: string = '';

  showRecoverPassword: boolean = false;
  recoverEmail: string = '';
  recoverMessage: string = '';
  recoverError: string = '';

  // Asumimos que el email está en el perfil del usuario
  userEmail: string = '';
  /**
   * Constructor con servicios inyectados.
   * @param userService Servicio para operaciones de usuario.
   * @param authService Servicio para autenticación y 2FA.
   */
  constructor(private userService: UserService, private authService: AuthService) {}
  /**
   * Inicializa el componente consultando si el usuario tiene Be Pass
   * y obtiene su email para futuras operaciones como recuperación.
   */
  ngOnInit(): void {
    this.userService.hasBepass().subscribe({
      next: (res) => {
        this.hasBePass = res.hasBepass;
      },
      error: () => {
        this.hasBePass = false;
      }
    });
    // Obtener email del usuario
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.userEmail = user.email || user.correo_electronico || '';
        this.recoverEmail = this.userEmail;
      }
    });
  }
  /**
   * Evento que se activa cuando el usuario verifica el 2FA con éxito.
   * @param success Resultado del evento de verificación.
   */
  on2FAVerified(success: boolean) {
    if (success) {
      this.is2FAVerified = true;
    }
  }
  /**
   * Filtra entrada para que solo se ingresen números en los campos Be Pass.
   */
  onBepassInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    // Reemplaza cualquier caracter que no sea un número
    input.value = input.value.replace(/[^0-9]/g, '');
    
    // Asigna el valor limpio al modelo correcto
    if (input.name === 'newBepass') {
      this.bepassData.newBepass = input.value;
    } else if (input.name === 'confirmBepass') {
      this.bepassData.confirmBepass = input.value;
    }
  }
  /**
   * Envío del formulario para crear Be Pass y configurar 2FA.
   */
  onSubmit(): void {
    this.message = '';
    this.error = '';

    if (this.bepassData.newBepass !== this.bepassData.confirmBepass) {
      this.error = 'Las claves Be Pass no coinciden.';
      return;
    }

    if (!/^[0-9]{6}$/.test(this.bepassData.newBepass)) {
      this.error = 'La clave Be Pass debe contener exactamente 6 números.';
      return;
    }

    this.userService.setBepass({ ...this.bepassData, isChange: false }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.bepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
        this.hasBePass = true; // Actualizar estado inmediatamente
        
        // Consultar setup2FA tras crear el Be Pass
        this.authService.setup2FA().subscribe({
          next: (res) => {
            if (res.qr) {
              this.qrData = res.qr;
              this.show2FAQr = true;
            }
          },
          error: () => {
            // Si ya tiene 2FA, no mostrar nada
            this.show2FAQr = false;
          }
        });
      },
      error: (err) => {
        this.error = err.error.message || 'Ocurrió un error al actualizar la clave.';
      }
    });
  }
  /**
   * Cierra el modal de QR 2FA.
   */
  close2FAQr() {
    this.show2FAQr = false;
    this.qrData = '';
    // Redirigir a configuración después de cerrar el QR
    window.location.href = '/configuracion?tab=seguridad';
  }
 /**
   * Maneja entradas numéricas para cambio de Be Pass.
   */
  onChangeBepassInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.name === 'newBepass') {
      this.changeBepassData.newBepass = input.value;
    } else if (input.name === 'confirmBepass') {
      this.changeBepassData.confirmBepass = input.value;
    }
  }
  /**
   * Envío del formulario para cambiar Be Pass.
   */
  onChangeBepassSubmit(): void {
    this.changeMessage = '';
    this.changeError = '';
    if (this.changeBepassData.newBepass !== this.changeBepassData.confirmBepass) {
      this.changeError = 'Las claves Be Pass no coinciden.';
      return;
    }
    if (!/^[0-9]{6}$/.test(this.changeBepassData.newBepass)) {
      this.changeError = 'La clave Be Pass debe contener exactamente 6 números.';
      return;
    }
    this.userService.setBepass({ ...this.changeBepassData, isChange: true }).subscribe({
      next: (response) => {
        this.changeMessage = response.message;
        this.changeBepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
      },
      error: (err) => {
        this.changeError = err.error.message || 'Ocurrió un error al cambiar la clave.';
      }
    });
  }
  /**
   * Abre el formulario de recuperación de contraseña.
   */
  openRecoverPassword() {
    this.showRecoverPassword = true;
    this.recoverMessage = '';
    this.recoverError = '';
    this.recoverEmail = this.userEmail;
  }
  /**
   * Cierra el modal de recuperación de contraseña.
   */
  closeRecoverPassword() {
    this.showRecoverPassword = false;
  }
  /**
   * Envío del formulario para solicitar recuperación de contraseña por email.
   */
  onRecoverPasswordSubmit() {
    this.recoverMessage = '';
    this.recoverError = '';
    this.authService.forgotPassword(this.recoverEmail).subscribe({
      next: (res) => {
        this.recoverMessage = res.message || 'Si el correo es válido, recibirás instrucciones para restablecer tu contraseña.';
      },
      error: (err) => {
        this.recoverError = err.error?.message || 'Ocurrió un error al enviar el correo.';
      }
    });
  }
}
