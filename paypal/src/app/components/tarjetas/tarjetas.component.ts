import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CuentasService, Cuenta } from '../../services/cuentas.service';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserService } from '../../services/user.service';
import { CardService } from '../../services/card.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { FormatCardNumberPipe } from '../../utils/format-card-number.pipe';
import { Router } from '@angular/router';

// Interfaces para tipar los datos del backend
export interface Card {
  id: string;
  cardNumber: string;
  cvv: string;
  expirationDate: string;
  is_blocked: boolean;
}

export interface CuentaConTarjeta extends Cuenta {
  cards: Card[];
}

@Component({
  selector: 'app-tarjetas',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, HttpClientModule, FormatCardNumberPipe],
  providers: [UserService, CardService],
  templateUrl: './tarjetas.component.html',
  styleUrls: ['./tarjetas.component.scss']
})
export class TarjetasComponent implements OnInit, OnDestroy {
  isLoading: boolean = true;
  cuentas: Cuenta[] = [];
  selectedCuenta: Cuenta | null = null;
  currentCard: Card | null = null;
  userName: string = 'Usuario';
  titular: string = 'Nombre Apellido';
  showCardDetails: boolean = false;
  showSelectionPanel: boolean = false;
  error: string | null = null;
  hasCuentaDeAhorro: boolean = false;

  // El estado de la tarjeta ya no se guarda aquí
  showFullCardDetails: boolean = false;
  private cardDetailsTimeout: any;

  private detailsTimerSubscription: Subscription | null = null;
  private actionToConfirm: 'viewDetails' | 'toggleBlock' | null = null;

  constructor(
    private cuentasService: CuentasService,
    private userService: UserService,
    private cardService: CardService,
    private http: HttpClient,
    private modalService: NgbModal,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    // Restaurar selección de cuenta si existe
    const savedCuentaId = localStorage.getItem('selectedCuentaId');
    if (savedCuentaId) {
      this.selectedCuenta = null; // Se asignará correctamente tras cargar cuentas
    }
  }

  ngOnDestroy(): void {
    if (this.detailsTimerSubscription) {
      this.detailsTimerSubscription.unsubscribe();
    }
  }

  loadInitialData(): void {
    this.isLoading = true;
    // Obtener nombre del usuario
    this.http.get<any>('/api/users/profile').pipe(
      tap(profile => {
        this.userName = `${profile.nombre} ${profile.apellido}`.toUpperCase();
        this.titular = this.userName; // Actualizar titular aquí
      }),
      catchError(() => {
        this.userName = 'USUARIO'; // Valor por defecto en caso de error
        this.titular = this.userName;
        return of(null);
      })
    ).subscribe(() => {
      // Una vez tenemos el nombre, cargamos las cuentas
      this.loadCuentas();
    });
  }

  loadCuentas(): void {
    this.cuentasService.getCuentas().subscribe({
      next: (cuentasData) => {
        this.cuentas = cuentasData;
        // Restaurar selección si existe en localStorage
        const savedCuentaId = localStorage.getItem('selectedCuentaId');
        if (savedCuentaId) {
          const cuentaGuardada = this.cuentas.find(c => c.id.toString() === savedCuentaId);
          if (cuentaGuardada) {
            this.selectedCuenta = cuentaGuardada;
          } else {
            this.selectedCuenta = this.cuentas[0];
          }
        } else if (this.cuentas.length > 0 && !this.selectedCuenta) {
          this.selectedCuenta = this.cuentas[0];
        }
        // Asignar la tarjeta actual si existe
        if (this.selectedCuenta && this.selectedCuenta.cards && this.selectedCuenta.cards.length > 0) {
          this.currentCard = this.selectedCuenta.cards[0];
        } else {
          this.currentCard = null;
        }
        this.hasCuentaDeAhorro = this.cuentas.some(c => c.tipo_cuenta === 'Cuenta de Ahorro');
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar tus cuentas y tarjetas.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  solicitarCuentaDeAhorro(): void {
    // Mostrar el modal Bootstrap
    const modal = new (window as any).bootstrap.Modal(document.getElementById('cuentaAhorroModal'));
    modal.show();
  }

  confirmarCuentaAhorro(): void {
    this.cuentasService.createCuenta('Cuenta de Ahorro').subscribe({
      next: () => {
        // Mostrar modal de éxito
        const modal = new (window as any).bootstrap.Modal(document.getElementById('ahorroSuccessModal'));
        modal.show();
        this.loadCuentas(); // Recargar los datos
      },
      error: (err) => {
        this.error = err.error.message || 'No se pudo crear la cuenta de ahorro.';
      }
    });
  }

  selectCuenta(cuenta: Cuenta): void {
    this.selectedCuenta = cuenta;
    localStorage.setItem('selectedCuentaId', cuenta.id.toString()); // Guardar selección
    this.showSelectionPanel = false;
    this.showFullCardDetails = false;
    if (this.cardDetailsTimeout) {
      clearTimeout(this.cardDetailsTimeout);
    }
    // Asignar la tarjeta actual si existe
    if (this.selectedCuenta && this.selectedCuenta.cards && this.selectedCuenta.cards.length > 0) {
      this.currentCard = this.selectedCuenta.cards[0];
    } else {
      this.currentCard = null;
    }
  }

  toggleBlockCard(isVerified: boolean = false): void {
    if (!this.currentCard) return;

    // Si la tarjeta está bloqueada, necesitamos la clave para desbloquear
    if (this.currentCard.is_blocked && !isVerified) {
       // El modal debe ser abierto por otro método que pase la plantilla.
       // Esta lógica se moverá al manejador del botón.
      return; 
    }

    const newStatus = !this.currentCard.is_blocked;
    this.cardService.toggleBlock(this.currentCard.id).subscribe({
      next: (updatedCard: Card) => {
        this.currentCard = updatedCard;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.error.message || `Error al ${newStatus ? 'bloquear' : 'desbloquear'} la tarjeta.`;
        this.cdr.detectChanges();
      }
    });
  }

  promptForBePass(action: 'viewDetails' | 'toggleBlock', bepassModal: any): void {
    // Verificar si el usuario tiene Be Pass antes de mostrar el modal
    this.userService.hasBepass().subscribe({
      next: (res) => {
        if (res.hasBepass) {
          this.actionToConfirm = action;
          this.modalService.open(bepassModal, { centered: true, ariaLabelledBy: 'modal-title' });
        } else {
          // Mostrar modal de advertencia
          const modal = new (window as any).bootstrap.Modal(document.getElementById('bepassRequiredModal'));
          modal.show();
        }
      },
      error: () => {
        // En caso de error, asumir que no tiene Be Pass
        const modal = new (window as any).bootstrap.Modal(document.getElementById('bepassRequiredModal'));
        modal.show();
      }
    });
  }

  handleBePassConfirmation(bepass: string, modal: any): void {
    if (!bepass || bepass.length !== 6) {
      this.error = "La clave Be Pass debe tener 6 dígitos.";
      return;
    }
    
    this.userService.verifyBepass(bepass).subscribe({
      next: (response: { success: boolean }) => {
        if (response.success) {
          modal.close();
          if (this.actionToConfirm === 'viewDetails') {
            this.revealCardDetails();
          } else if (this.actionToConfirm === 'toggleBlock') {
            this.toggleBlockCard(true);
          }
        } else {
          this.error = "Clave Be Pass incorrecta.";
          this.cdr.detectChanges();
        }
      },
      error: (err: any) => {
        this.error = err.error.message || "Error al verificar la clave Be Pass.";
        this.cdr.detectChanges();
      }
    });
  }
  
  revealCardDetails(): void {
    this.showCardDetails = true;
    this.cdr.detectChanges();

    // Ocultar detalles después de 30 segundos
    this.detailsTimerSubscription = timer(30000).subscribe(() => {
      this.showCardDetails = false;
      this.cdr.detectChanges();
    });
  }

  get isMastercard(): boolean {
    return this.selectedCuenta?.tipo_cuenta !== 'Cuenta Vista';
  }

  toggleSelectionPanel(): void {
    this.showSelectionPanel = !this.showSelectionPanel;
  }

  goToSecurity() {
    this.router.navigate(['/security']);
  }
} 