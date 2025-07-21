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

  constructor(private http: HttpClient, private router: Router) {}

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
      M = M < 7 ? M + 1 : 2;
    }

    const VCalc = 11 - (sum % 11);
    const dvCalc = VCalc === 11 ? '0' : VCalc === 10 ? 'k' : VCalc.toString();

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
    this.rutError = '';
    this.rutExistsError = '';

    if (formattedValue && !this.validateRut(formattedValue)) {
      this.rutError = 'El RUT ingresado no es válido.';
    } else if (formattedValue) {
      this.rutSubject.next(formattedValue);
    }
  }

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

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
