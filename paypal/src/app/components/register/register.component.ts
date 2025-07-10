import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  user = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ciudad: '',
    pais: '',
    email: '',
    password: '',
    rut: ''
  };
  rutError: string = '';
  rutExistsError: string = '';
  passwordError: string = '';
  fechaNacimientoError: string = '';
  private rutSubject = new Subject<string>();
  private rutSubscription: Subscription | undefined;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.rutSubscription = this.rutSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.rutExistsError = ''), // Limpia el error anterior
      switchMap(rut => {
        if (this.validateRut(rut)) {
          return this.http.get<{ exists: boolean }>(`http://localhost:3000/api/auth/check-rut/${rut}`).pipe(
            catchError(() => of({ exists: false })) // En caso de error, no bloquear el registro
          );
        }
        return of({ exists: false });
      })
    ).subscribe(response => {
      if (response.exists) {
        this.rutExistsError = 'El RUT ya se encuentra registrado.';
      }
    });
  }

  ngOnDestroy(): void {
    this.rutSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {}

  validateRut(rut: string): boolean {
    if (!rut) return false;
    rut = rut.replace(/\./g, '').replace('-', '').trim().toLowerCase();
    const body = rut.slice(0, -1);
    let dv = rut.slice(-1);

    if (!/^[0-9]+[0-9kK]{1}$/.test(rut)) return false;
    
    let sum = 0;
    let M = 2;
    for (let i = body.length - 1; i >= 0; i--) {
        sum += parseInt(body.charAt(i), 10) * M;
        if (M < 7) { M++; } else { M = 2; }
    }
    
    const VCalc = 11 - (sum % 11);
    const dvCalc = (VCalc === 11) ? '0' : (VCalc === 10) ? 'k' : VCalc.toString();

    return dvCalc === dv;
  }

  formatRut(rut: string): string {
    rut = rut.replace(/[^0-9kK]/g, '');
    if (rut.length > 1) {
      const body = rut.slice(0, -1);
      const dv = rut.slice(-1);
      rut = `${body}-${dv}`;
    }
    return rut;
  }
  
  onRutChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatRut(input.value);
    this.user.rut = formattedValue;
    
    // Limpiar errores para la nueva validación
    this.rutError = '';
    this.rutExistsError = '';

    if (formattedValue && !this.validateRut(formattedValue)) {
      this.rutError = 'El RUT ingresado no es válido.';
    } else if (formattedValue) {
      this.rutSubject.next(formattedValue);
    }
  }

  capitalizeFirstLetter(value: string): string {
    if (!value) return '';
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  onNombreBlur() {
    this.user.nombre = this.capitalizeFirstLetter(this.user.nombre);
  }

  onApellidoBlur() {
    this.user.apellido = this.capitalizeFirstLetter(this.user.apellido);
  }

  onCiudadBlur() {
    this.user.ciudad = this.capitalizeFirstLetter(this.user.ciudad);
  }

  onPaisBlur() {
    this.user.pais = this.capitalizeFirstLetter(this.user.pais);
  }

  // Validación personalizada para la contraseña
  validatePassword(password: string): boolean {
    // Solo requiere mínimo 6 caracteres
    return typeof password === 'string' && password.length >= 6;
  }

  validateFechaNacimiento(fecha: string): boolean {
    if (!fecha) return false;
    const hoy = new Date();
    const fechaNacimiento = new Date(fecha);
    if (fechaNacimiento > hoy) return false; // No permitir fechas futuras
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    const d = hoy.getDate() - fechaNacimiento.getDate();
    let edadReal = edad;
    if (m < 0 || (m === 0 && d < 0)) {
      edadReal--;
    }
    if (edadReal < 18 || edadReal > 120) return false;
    return true;
  }

  getFechaNacimientoError(): string {
    if (!this.user.fecha_nacimiento) return '';
    const hoy = new Date();
    const fechaNacimiento = new Date(this.user.fecha_nacimiento);
    if (fechaNacimiento > hoy) {
      return 'La fecha de nacimiento no puede ser en el futuro.';
    }
    const edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const m = hoy.getMonth() - fechaNacimiento.getMonth();
    const d = hoy.getDate() - fechaNacimiento.getDate();
    let edadReal = edad;
    if (m < 0 || (m === 0 && d < 0)) {
      edadReal--;
    }
    if (edadReal < 18) {
      return 'Debes ser mayor de 18 años para registrarte.';
    }
    if (edadReal > 120) {
      return 'La edad máxima permitida es 120 años.';
    }
    return '';
  }

  getEmailError(form: NgForm): string {
    const emailCtrl = form.controls['email'];
    if (emailCtrl && emailCtrl.touched && emailCtrl.invalid) {
      if (emailCtrl.errors?.['required']) {
        return 'El correo electrónico es obligatorio.';
      }
      if (emailCtrl.errors?.['email']) {
        return 'El formato del correo electrónico no es válido.';
      }
    }
    return '';
  }

  getPasswordError(form: NgForm): string {
    const passwordCtrl = form.controls['password'];
    if (passwordCtrl && passwordCtrl.touched) {
      if (passwordCtrl.errors?.['required']) {
        return 'La contraseña es obligatoria.';
      }
      if (passwordCtrl.errors?.['minlength'] || !this.validatePassword(passwordCtrl.value)) {
        return 'La contraseña debe tener al menos 6 caracteres.';
      }
    }
    return '';
  }

  onSubmit(registerForm: NgForm) {
    this.passwordError = '';
    this.fechaNacimientoError = this.getFechaNacimientoError();
    if (!this.validatePassword(this.user.password)) {
      this.passwordError = 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (registerForm.invalid || this.rutError || this.rutExistsError || this.passwordError || this.fechaNacimientoError) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    this.http.post('http://localhost:3000/api/auth/register', this.user)
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          // Mostrar modal de éxito
          const modal = new (window as any).bootstrap.Modal(document.getElementById('successModal'));
          modal.show();
        },
        error: (error) => {
          console.error('Error en el registro', error);
          const errorMessage = error.error.message || 'Hubo un error durante el registro.';
          if (typeof errorMessage === 'string') {
            alert(errorMessage);
          } else if (Array.isArray(errorMessage)) {
            alert(errorMessage.join('\n'));
          } else {
          alert('Hubo un error durante el registro. Por favor, inténtalo de nuevo.');
          }
        }
      });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
} 