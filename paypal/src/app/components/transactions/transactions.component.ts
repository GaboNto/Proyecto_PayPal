import { Component, OnInit, OnDestroy, ViewChild, ElementRef, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { TransferService } from '../../services/transfer.service';
import { CuentasService } from '../../services/cuentas.service';
import { DestinatariosService, Destinatario, CreateDestinatario } from '../../services/destinatarios.service';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, tap, switchMap, take } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

interface Cuenta {
  id: number;
  numero_cuenta: string;
  tipo_cuenta: string;
  saldo: number;
  fecha_apertura: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule, NgbModalModule, TranslateModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideInOut', [
      state('out', style({
        maxHeight: '0px',
        opacity: '0',
        visibility: 'hidden',
        margin: '0'
      })),
      state('in', style({
        maxHeight: '500px', // Debe ser suficiente para el contenido
        opacity: '1',
        visibility: 'visible',
        marginTop: '1rem',
        marginBottom: '1rem'
      })),
      transition('in <=> out', animate('400ms ease-in-out'))
    ])
  ]
})
export class TransactionsComponent implements OnInit, OnDestroy {
  activeTab: 'new' | 'history' | 'internal' = 'new';
  
  saldoActual: number = 0;
  destinatarios$: Observable<Destinatario[]> = of([]);
  showAddDestinatarioForm: boolean = false;
  editingDestinatarioId: number | null = null;
  
  newDestinatario: CreateDestinatario = {
    nombre: '',
    rut: '',
    alias: '',
    correo_electronico: '',
    banco: '',
    tipo_cuenta: '',
    numero_cuenta: ''
  };

  transferData = {
    nombre_destinatario: '',
    rut_destinatario: '',
    banco_destino: '',
    tipo_cuenta: '',
    numero_cuenta: '',
    monto: null as number | null,
    bepass: ''
  };
  message: string = '';
  error: string = '';
  rutError: string = '';
  montoError: string = '';

  bancos: string[] = ['Paypal', 'BancoEstado', 'BCI', 'Banco de Chile', 'Scotiabank', 'Banco Falabella'];
  tiposDeCuenta: string[] = ['Cuenta Vista', 'Cuenta Corriente', 'Cuenta de Ahorro'];
  
  // Nuevas propiedades para transferencia interna
  cuentas: Cuenta[] = [];
  cuentaOrigenId: number | null = null;
  cuentaDestinoId: number | null = null;
  montoInterno: number | null = null;
  bepassInterno: string = '';

  private transferType: 'external' | 'internal' = 'external';

  // Propiedades para la modal de Be Pass
  @ViewChild('bepassModal') bepassModalRef!: ElementRef;
  private modalReference: any;
  bepassFromModal: string = '';
  countdownSubscription: Subscription | null = null;
  countdownDisplay: string = '02:00';
  isCountdownRunning: boolean = false;

  saldoDisponibleSeleccionado: number = 0;

  historial: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  today: string = new Date().toISOString().slice(0, 10);

  transferenciaSeleccionada: any = null;

  filtroMonto: number|null = null;
  filtroDestinatario: string = '';

  constructor(
    private http: HttpClient,
    private transferService: TransferService,
    private cuentasService: CuentasService,
    private destinatariosService: DestinatariosService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.loadSaldo();
    this.loadDestinatarios();
    this.transferData.banco_destino = this.bancos[0]; 
    this.onBancoChange();
    this.loadUserAccounts();
    this.actualizarSaldoDisponible();
    this.setFechasHistorial();
    this.cargarHistorial();
  }

  ngAfterViewInit(): void {
    // Ya no es necesario inicializar el modal de bootstrap aquí.
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  loadDestinatarios(): void {
    this.destinatarios$ = this.destinatariosService.getDestinatarios();
  }

  onAddDestinatarioSubmit(): void {
    if (this.editingDestinatarioId) {
      // Modo Edición
      this.destinatariosService.updateDestinatario(this.editingDestinatarioId, this.newDestinatario).subscribe({
        next: () => {
          this.resetAndReload();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error al actualizar destinatario.';
          this.cdr.detectChanges();
        }
      });
    } else {
      // Modo Creación
      this.destinatariosService.createDestinatario(this.newDestinatario).subscribe({
        next: () => {
          this.resetAndReload();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error al agregar destinatario.';
          this.cdr.detectChanges();
        }
      });
    }
  }
  
  handleEdit(destinatario: Destinatario): void {
    this.editingDestinatarioId = destinatario.id;
    this.newDestinatario = { ...destinatario };
    this.showAddDestinatarioForm = true;
    window.scrollTo(0, 0); 
  }

  handleDelete(id: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar este destinatario?')) {
      this.destinatariosService.deleteDestinatario(id).subscribe({
        next: () => {
          this.loadDestinatarios();
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.error = 'Error al eliminar el destinatario.';
          this.cdr.detectChanges();
        }
      });
    }
  }

  cancelEdit(): void {
    this.showAddDestinatarioForm = false;
    this.editingDestinatarioId = null;
    this.resetNewDestinatarioForm();
  }

  private resetAndReload(): void {
    this.loadDestinatarios();
    this.showAddDestinatarioForm = false;
    this.editingDestinatarioId = null;
    this.resetNewDestinatarioForm();
  }

  toggleFavorito(id: number): void {
    this.destinatarios$ = this.destinatariosService.toggleFavorito(id).pipe(
      switchMap(() => this.destinatariosService.getDestinatarios()),
      catchError(err => {
        this.error = 'Error al actualizar favorito.';
        return of([]);
      })
    );
  }

  seleccionarDestinatario(d: Destinatario): void {
    this.transferData.nombre_destinatario = d.nombre;
    this.transferData.rut_destinatario = d.rut;
    this.transferData.banco_destino = d.banco;
    this.transferData.tipo_cuenta = d.tipo_cuenta;
    this.transferData.numero_cuenta = d.numero_cuenta;
    window.scrollTo(0, document.body.scrollHeight);
  }

  resetNewDestinatarioForm(): void {
    this.newDestinatario = {
      nombre: '', rut: '', alias: '', correo_electronico: '',
      banco: '', tipo_cuenta: '', numero_cuenta: ''
    };
  }
  
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
    const originalValue = input.value;
    const formattedValue = this.formatRut(originalValue);
    this.transferData.rut_destinatario = formattedValue;
    
    if (formattedValue && !this.validateRut(formattedValue)) {
      this.rutError = 'El RUT ingresado no es válido.';
    } else {
      this.rutError = '';
    }
  }

  onMontoChange(): void {
    if (this.transferData.monto === null || this.transferData.monto <= 0) {
        this.montoError = '';
        return;
    }
    this.actualizarSaldoDisponible();
    const saldoDisponible = this.saldoDisponibleSeleccionado;
    const comision = this.transferData.banco_destino !== 'Paypal' ? 300 : 0;
    const montoTotal = this.transferData.monto + comision;

    if (montoTotal > saldoDisponible) {
      if (comision > 0) {
        this.montoError = `Saldo insuficiente para realizar la transferencia. Recuerda que la comisión es de $${comision} y el total a descontar será $${montoTotal}.`;
      } else {
        this.montoError = `Saldo insuficiente para realizar la transferencia. El total a descontar será $${montoTotal}.`;
      }
    } else {
      this.montoError = '';
    }
  }

  onNumeroCuentaInput(event: Event): void {
      const input = event.target as HTMLInputElement;
      input.value = input.value.replace(/[^0-9]/g, '');
      this.transferData.numero_cuenta = input.value;
      this.onMontoChange();
  }

  onBancoChange(): void {
    if (this.transferData.banco_destino === 'Paypal') {
      this.transferData.tipo_cuenta = 'Cuenta Vista';
    }
    this.onMontoChange();
  }

  isPaypalSelected(): boolean {
    return this.transferData.banco_destino === 'Paypal';
  }

  loadSaldo(): void {
    this.cuentasService.getCuentas().subscribe({
      next: (cuentas) => {
        const cuentaPrincipal = cuentas.find(c => c.tipo_cuenta === 'Cuenta Vista');
        this.saldoActual = cuentaPrincipal ? cuentaPrincipal.saldo : 0;
        this.onMontoChange(); // Re-evaluar el monto con el nuevo saldo.
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'No se pudo cargar el saldo.';
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit(): void {
    this.error = '';
    this.message = '';
    this.montoError = '';
    this.rutError = '';

    let isValid = true;

    if (!this.transferData.nombre_destinatario || !this.transferData.rut_destinatario || !this.transferData.banco_destino || !this.transferData.tipo_cuenta || !this.transferData.numero_cuenta) {
      this.error = 'Por favor, complete todos los campos del destinatario.';
      isValid = false;
    }

    if (this.transferData.monto === null || this.transferData.monto <= 0) {
      this.montoError = 'El monto debe ser mayor a cero.';
      isValid = false;
    } else {
      this.actualizarSaldoDisponible();
      const saldoDisponible = this.saldoDisponibleSeleccionado;
      const comision = this.transferData.banco_destino !== 'Paypal' ? 300 : 0;
      const montoTotal = this.transferData.monto + comision;
      if (montoTotal > saldoDisponible) {
        if (comision > 0) {
          this.montoError = `Saldo insuficiente para realizar la transferencia. Recuerda que la comisión es de $${comision} y el total a descontar será $${montoTotal}.`;
        } else {
          this.montoError = `Saldo insuficiente para realizar la transferencia. El total a descontar será $${montoTotal}.`;
        }
        isValid = false;
      }
    }
    
    if (this.transferData.rut_destinatario && !this.validateRut(this.transferData.rut_destinatario)) {
      this.rutError = 'El RUT ingresado no es válido.';
      isValid = false;
    }

    if (isValid) {
      this.openBepassModal();
    } else {
      this.cdr.detectChanges();
    }
  }

  openBepassModal() {
    this.error = '';
    this.startCountdown();
    this.modalReference = this.modalService.open(this.bepassModalRef, {ariaLabelledBy: 'modal-basic-title', centered: true});
    
    this.modalReference.result.then(
      (result: any) => {
        // El modal se cerró (ej. con Confirmar)
        // La lógica de confirmación ya se ejecutó desde el botón.
        // Limpiamos el contador aquí.
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
          this.isCountdownRunning = false;
        }
      },
      (reason: any) => {
        // El modal se descartó (ej. con Cancelar, ESC, click fuera)
        this.cancelTransfer();
      }
    );
  }

  private startCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    const twoMinutes = 120;
    this.countdownDisplay = '02:00';
    this.isCountdownRunning = true;

    // Ejecutamos el timer fuera de la zona de Angular para no disparar
    // la detección de cambios en cada tick del segundero.
    this.zone.runOutsideAngular(() => {
      this.countdownSubscription = timer(0, 1000).pipe(
        take(twoMinutes + 1)
      ).subscribe(secondsElapsed => {
        const secondsLeft = twoMinutes - secondsElapsed;

        // Volvemos a entrar a la zona de Angular solo para actualizar la vista
        this.zone.run(() => {
          if (secondsLeft >= 0) {
            const minutes = Math.floor(secondsLeft / 60);
            const seconds = secondsLeft % 60;
            this.countdownDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
          } else {
            // Cuando el tiempo se acaba, cancelamos la transferencia
            this.cancelTransfer();
            this.error = 'Se agotó el tiempo. La transferencia ha sido cancelada.';
          }
          this.cdr.detectChanges();
        });
      });
    });
  }

  cancelTransfer(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
    this.isCountdownRunning = false;
    this.bepassFromModal = '';
    // Opcional: añadir un mensaje si se desea
    // this.error = "Transferencia cancelada por el usuario.";
    this.cdr.detectChanges();
  }

  confirmTransferWithBepass(): void {
    if (!this.bepassFromModal || this.bepassFromModal.length < 4) { // Asumiendo una longitud mínima
      this.error = 'Por favor, ingrese su Clave Be Pass válida.';
      this.cdr.detectChanges();
      return;
    }

    if (this.transferType === 'external') {
      this.executeExternalTransfer();
    } else {
      this.executeInternalTransfer();
    }
    
    if (this.modalReference) {
      this.modalReference.close();
    }
  }

  private executeExternalTransfer(): void {
    this.transferData.bepass = this.bepassFromModal;
    // Limpiar payload: solo enviar los campos necesarios
    const payload = {
      ...this.transferData,
      cuentaOrigenId: this.cuentaOrigenId
    };
    this.transferService.createTransfer(payload).subscribe({
      next: (response) => {
        this.message = '¡Transferencia realizada con éxito!';
        this.error = '';
        this.resetForm();
        this.loadUserAccounts(); // Recarga las cuentas y saldos
        this.loadSaldo(); // Recarga el saldo principal
        this.cancelTransfer(); // Cierra modal y detiene contador
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.error.message || 'Ocurrió un error al realizar la transferencia.';
        this.message = '';
        this.cdr.detectChanges();
      }
    });
  }

  private executeInternalTransfer(): void {
    const cuentaOrigen = this.cuentas.find(c => c.id === this.cuentaOrigenId);
    const saldoDisponible = cuentaOrigen ? cuentaOrigen.saldo : 0;
    const comision = 0; // Transferencia interna, nunca hay comisión
    const montoTotal = Number(this.montoInterno) + comision;

    if (montoTotal > saldoDisponible) {
      this.error = `Saldo insuficiente para realizar la transferencia interna. El total a descontar será $${montoTotal}.`;
      this.cdr.detectChanges();
      return;
    }

    const internalTransferData = {
      cuentaOrigenId: Number(this.cuentaOrigenId),
      cuentaDestinoId: Number(this.cuentaDestinoId),
      monto: Number(this.montoInterno),
      bepass: this.bepassFromModal
    };

    // Log para depuración
    console.log('internalTransferData:', internalTransferData);

    if (!internalTransferData.cuentaDestinoId || isNaN(internalTransferData.cuentaDestinoId)) {
      this.error = 'Debes seleccionar una cuenta de destino válida.';
      this.cdr.detectChanges();
      return;
    }
    if (!internalTransferData.cuentaOrigenId || isNaN(internalTransferData.cuentaOrigenId)) {
      this.error = 'Debes seleccionar una cuenta de origen válida.';
      this.cdr.detectChanges();
      return;
    }
    if (!internalTransferData.monto || isNaN(internalTransferData.monto) || internalTransferData.monto <= 0) {
      this.error = 'El monto debe ser un número positivo.';
      this.cdr.detectChanges();
      return;
    }

    this.transferService.transferBetweenOwnAccounts(internalTransferData).subscribe({
      next: (response: any) => {
        this.message = '¡Transferencia interna realizada con éxito!';
        this.error = '';
        this.resetInternalForm();
        this.loadUserAccounts();
        this.loadSaldo();
        this.cancelTransfer();
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        this.error = err.error.message || 'Ocurrió un error en la transferencia interna.';
        this.message = '';
        this.cdr.detectChanges();
      }
    });
  }

  resetForm(): void {
    this.transferData = {
      nombre_destinatario: '',
      rut_destinatario: '',
      banco_destino: this.bancos[0],
      tipo_cuenta: 'Cuenta Vista',
      numero_cuenta: '',
      monto: null,
      bepass: ''
    };
    this.onBancoChange();
    this.cdr.detectChanges();
  }

  loadUserAccounts(): void {
    this.cuentasService.getCuentas().subscribe({
      next: (cuentas) => {
        this.cuentas = cuentas;
        // Si solo hay una cuenta, dejarla fija
        if (this.cuentas.length === 1) {
          this.cuentaOrigenId = this.cuentas[0].id;
        } else if (this.cuentas.length > 1) {
          // Si hay más de una, seleccionar la primera por defecto
          this.cuentaOrigenId = this.cuentas[0].id;
        }
        // Actualiza el saldo global (banner) y el saldo disponible del select
        const cuentaPrincipal = this.cuentas.find(c => c.tipo_cuenta === 'Cuenta Vista');
        this.saldoActual = cuentaPrincipal ? cuentaPrincipal.saldo : 0;
        this.actualizarSaldoDisponible();
        this.cdr.detectChanges();
      },
      error: () => {
        this.cuentas = [];
        this.cdr.detectChanges();
      }
    });
  }

  get filteredCuentasDestino(): Cuenta[] {
    if (!this.cuentaOrigenId) {
      return [];
    }
    return this.cuentas.filter(c => c.id !== this.cuentaOrigenId);
  }

  selectTab(tab: 'new' | 'history' | 'internal'): void {
    this.activeTab = tab;
    this.error = '';
    this.message = '';
    if (tab === 'history') {
      this.setFechasHistorial();
      this.cargarHistorial();
    }
  }

  onSubmitInternal(): void {
    if (!this.cuentaOrigenId || !this.cuentaDestinoId || !this.montoInterno || this.montoInterno <= 0) {
      this.error = 'Por favor, complete todos los campos para la transferencia interna.';
      this.cdr.detectChanges();
      return;
    }
    this.transferType = 'internal';
    this.openBepassModal();
  }
  
  private resetInternalForm(): void {
    this.cuentaOrigenId = null;
    this.cuentaDestinoId = null;
    this.montoInterno = null;
    this.bepassInterno = '';
  }

  actualizarSaldoDisponible(): void {
    const cuentaOrigen = this.cuentas.find(c => c.id === this.cuentaOrigenId);
    this.saldoDisponibleSeleccionado = cuentaOrigen ? cuentaOrigen.saldo : 0;
    this.cdr.detectChanges();
  }

  onCuentaOrigenChange(): void {
    this.actualizarSaldoDisponible();
    this.onMontoChange(); // Revalida el monto con el nuevo saldo
  }

  cargarHistorial(): void {
    this.transferService.getHistory(this.fechaInicio, this.fechaFin).subscribe({
      next: (data) => {
        this.historial = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.historial = [];
        this.cdr.detectChanges();
      }
    });
  }

  setFechasHistorial(): void {
    // Fecha de inicio: fecha de creación de la cuenta más antigua
    if (this.cuentas.length > 0) {
      const fechas = this.cuentas.map(c => new Date(c.fecha_apertura));
      const minFecha = new Date(Math.min(...fechas.map(f => f.getTime())));
      this.fechaInicio = minFecha.toISOString().slice(0, 10);
    } else {
      this.fechaInicio = new Date().toISOString().slice(0, 10);
    }
    // Fecha de fin: hoy
    this.fechaFin = new Date().toISOString().slice(0, 10);
  }

  verDetalles(transferencia: any): void {
    this.transferenciaSeleccionada = transferencia;
  }

  cerrarDetalles(): void {
    this.transferenciaSeleccionada = null;
  }

  get historialFiltrado() {
    return this.historial.filter(t => {
      const fechaValida = (!this.fechaInicio || t.fecha >= this.fechaInicio) && (!this.fechaFin || t.fecha <= this.fechaFin);
      const montoValido = this.filtroMonto == null || t.monto == this.filtroMonto;
      const destinatarioValido = !this.filtroDestinatario || (t.nombre_destinatario && t.nombre_destinatario.toLowerCase().includes(this.filtroDestinatario.toLowerCase()));
      return fechaValida && montoValido && destinatarioValido;
    });
  }
}

