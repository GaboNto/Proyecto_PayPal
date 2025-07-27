/**
 * Componente responsable del formulario de registro de nuevos usuarios.
 * Incluye validación de RUT chileno, verificación de duplicados, y aceptación de términos y condiciones.
 * Al registrar exitosamente, muestra un modal de confirmación.
 */
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, Subscription, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy, AfterViewInit {
  /**
   * Objeto que contiene los datos del formulario de registro.
   */
  user = {
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    ciudad: '',
    pais: '',
    email: '',
    password: '',
    rut: '',
    privacidad: false,          // 🔹 AGREGADO
    condiciones: false          // 🔹 AGREGADO
  };

  rutError: string = '';
  rutExistsError: string = '';
  private rutSubject = new Subject<string>();
  private rutSubscription: Subscription | undefined;
  /**
   * Inyección de dependencias para HTTP y navegación.
   * @param http Cliente HTTP para comunicar con el backend.
   * @param router Servicio de enrutamiento para redirigir al login.
   */
  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Inicializa la suscripción para verificar el RUT en backend con debounce.
   */
  ngOnInit(): void {
    this.rutSubscription = this.rutSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      tap(() => this.rutExistsError = ''),
      switchMap(rut => {
        if (this.validateRut(rut)) {
          return this.http.get<{ exists: boolean }>(`http://localhost:3000/api/auth/check-rut/${rut}`).pipe(
            catchError(() => of({ exists: false }))
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
  /**
   * Limpia la suscripción al destruir el componente.
   */
  ngOnDestroy(): void {
    this.rutSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {}
  /**
   * Valida el RUT chileno (con dígito verificador).
   * @param rut RUT ingresado por el usuario.
   * @returns `true` si es válido, `false` si no.
   */
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
      M = M < 7 ? M + 1 : 2;
    }

    const VCalc = 11 - (sum % 11);
    const dvCalc = VCalc === 11 ? '0' : VCalc === 10 ? 'k' : VCalc.toString();

    return dvCalc === dv;
  }
  /**
   * Da formato visual al RUT ingresado, separando cuerpo y dígito verificador con `-`.
   * @param rut RUT sin formato.
   * @returns RUT con formato (`XXXXXXXX-X`)
   */
  formatRut(rut: string): string {
    rut = rut.replace(/[^0-9kK]/g, '');
    if (rut.length > 1) {
      const body = rut.slice(0, -1);
      const dv = rut.slice(-1);
      rut = `${body}-${dv}`;
    }
    return rut;
  }
  /**
   * Se ejecuta al cambiar el valor del input de RUT.
   * Formatea, valida y dispara la verificación en backend.
   * @param event Evento de cambio del input.
   */
  onRutChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const formattedValue = this.formatRut(input.value);
    this.user.rut = formattedValue;
    this.rutError = '';
    this.rutExistsError = '';

    if (formattedValue && !this.validateRut(formattedValue)) {
      this.rutError = 'El RUT ingresado no es válido.';
    } else if (formattedValue) {
      this.rutSubject.next(formattedValue);
    }
  }
  /**
   * Envia el formulario de registro si los campos son válidos.
   * Muestra un modal de éxito o errores según la respuesta.
   * @param registerForm Formulario de registro (template-driven).
   */
  onSubmit(registerForm: NgForm) {
    if (
      registerForm.invalid ||
      this.rutError ||
      this.rutExistsError ||
      !this.user.privacidad ||
      !this.user.condiciones
    ) {
      alert('Por favor, completa todos los campos correctamente y acepta las condiciones.');
      return;
    }

    this.http.post('http://localhost:3000/api/auth/register', this.user)
      .subscribe({
        next: (response) => {
          console.log('Registro exitoso', response);
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
  /**
   * Redirige al usuario a la vista de login.
   */
  goToLogin() {
    this.router.navigate(['/login']);
  }
}
