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

  constructor(private userService: UserService, private authService: AuthService) {}

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

  on2FAVerified(success: boolean) {
    if (success) {
      this.is2FAVerified = true;
    }
  }

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

  close2FAQr() {
    this.show2FAQr = false;
    this.qrData = '';
  }

  onChangeBepassInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    if (input.name === 'newBepass') {
      this.changeBepassData.newBepass = input.value;
    } else if (input.name === 'confirmBepass') {
      this.changeBepassData.confirmBepass = input.value;
    }
  }

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

  openRecoverPassword() {
    this.showRecoverPassword = true;
    this.recoverMessage = '';
    this.recoverError = '';
    this.recoverEmail = this.userEmail;
  }
  closeRecoverPassword() {
    this.showRecoverPassword = false;
  }
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
