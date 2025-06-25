import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security.component.html',
  styleUrl: './security.component.css'
})
export class SecurityComponent {
  bepassData = {
    newBepass: '',
    confirmBepass: '',
    currentPassword: ''
  };

  message: string = '';
  error: string = '';

  constructor(private userService: UserService) {}

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

    this.userService.setBepass(this.bepassData).subscribe({
      next: (response) => {
        this.message = response.message;
        this.bepassData = { newBepass: '', confirmBepass: '', currentPassword: '' };
      },
      error: (err) => {
        this.error = err.error.message || 'Ocurrió un error al actualizar la clave.';
      }
    });
  }
}
