/**
 * Componente para crear, listar y visualizar metas financieras del usuario.
 * Permite ingresar nombre, monto objetivo, meses, prioridad y monto inicial.
 * 
 * También gestiona la lógica del formulario, progreso y visualización modal.
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
/**
 * Interfaz que representa una meta financiera individual.
 */
interface FinancialGoal {
  goalName: string;
  targetAmount: number;
  months: number;
  initialAmount?: number;
  priority: string;
  description?: string;
  createdAt: Date;
  progress: number;
}

@Component({
  selector: 'app-financial-goals',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './financial-goals.component.html',
  styleUrl: './financial-goals.component.scss'
})
export class FinancialGoalsComponent implements OnInit {
    /**
   * Controla si el modal de creación de meta está abierto.
   */
  showModal = false;
  
  /**
   * Formulario reactivo que gestiona la creación de nuevas metas.
   */
  goalForm: FormGroup;
  goals: FinancialGoal[] = [];
  /**
   * Inyección del `FormBuilder` para crear el formulario.
   * @param fb FormBuilder de Angular.
   */
  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      goalName: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      months: ['', [Validators.required, Validators.min(1)]],
      initialAmount: [''],
      priority: ['media', Validators.required],
      description: ['']
    });
  }
  /**
   * Método del ciclo de vida que inicializa una meta de ejemplo.
   */
  ngOnInit(): void {
    // Cargar metas existentes (ejemplo)
    this.goals = [
      {
        goalName: 'Viaje de Vacaciones',
        targetAmount: 1500000,
        months: 8,
        initialAmount: 150000,
        priority: 'media',
        description: 'Viaje de vacaciones para diciembre 2025',
        createdAt: new Date('2025-12-20'),
        progress: 10
      }
    ];
  }
  /**
   * Abre el modal y reinicia el formulario con prioridad por defecto.
   */
  openModal(): void {
    this.showModal = true;
    this.goalForm.reset({
      priority: 'media'
    });
  }
  /**
   * Cierra el modal y limpia el formulario.
   */
  closeModal(): void {
    this.showModal = false;
    this.goalForm.reset();
  }
  /**
   * Envía el formulario si es válido y crea una nueva meta financiera.
   * Calcula el progreso inicial con respecto al monto objetivo.
   */
  onSubmit(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      const newGoal: FinancialGoal = {
        ...formValue,
        createdAt: new Date(),
        progress: formValue.initialAmount ? 
          (formValue.initialAmount / formValue.targetAmount * 100) : 0
      };

      // Añadir la nueva meta al inicio del array
      this.goals.unshift(newGoal);
      
      // Actualizar el gráfico con los nuevos datos
      this.updateChartData();
      
      // Cerrar el modal después de guardar
      this.closeModal();
    }
  }

  /**
   * Actualiza el gráfico de metas si existiera integración visual.
   */
  updateChartData(): void {
    // Aquí puedes actualizar los datos del gráfico si es necesario
    // Por ejemplo, recalcular porcentajes, actualizar barras, etc.
  }

    /**
   * Formatea un monto en pesos chilenos.
   * @param amount Valor numérico
   * @returns Monto con formato CLP
   */
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

   /**
   * Formatea una fecha al formato dd-mm-yyyy.
   * @param date Fecha a formatear
   * @returns Fecha formateada en español
   */
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}
