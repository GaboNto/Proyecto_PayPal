import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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
    FormsModule,
    TranslateModule
  ],
  templateUrl: './financial-goals.component.html',
  styleUrl: './financial-goals.component.scss'
})
export class FinancialGoalsComponent implements OnInit {
  showModal = false;
  goalForm: FormGroup;
  goals: FinancialGoal[] = [];

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

  openModal(): void {
    this.showModal = true;
    this.goalForm.reset({
      priority: 'media'
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.goalForm.reset();
  }

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

  updateChartData(): void {
    // Aquí puedes actualizar los datos del gráfico si es necesario
    // Por ejemplo, recalcular porcentajes, actualizar barras, etc.
  }

  // Función auxiliar para formatear montos
  formatAmount(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }

  // Función auxiliar para formatear fechas
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}
