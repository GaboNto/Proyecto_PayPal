import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface FinancialGoal {
  id?: string;
  goalName: string;
  targetAmount: number;
  duration: number;
  interestRate: number;
  initialAmount?: number;
  priority: string;
  description?: string;
  createdAt: Date;
  progress: number;
  monthlySavings?: number;
  totalSavings?: number;
  totalInterest?: number;
  yearlySavings?: number;
}

interface CalculationResult {
  monthlySavings: number;
  totalSavings: number;
  totalInterest: number;
  yearlySavings: number;
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
  showModal = false;
  goalForm: FormGroup;
  goals: FinancialGoal[] = [];
  calculationResult: CalculationResult | null = null;
  editingGoal: FinancialGoal | null = null;

  constructor(private fb: FormBuilder) {
    this.goalForm = this.fb.group({
      goalName: ['', Validators.required],
      targetAmount: ['', [Validators.required, Validators.min(1)]],
      duration: ['', [Validators.required, Validators.min(1), Validators.max(50)]],
      interestRate: ['', [Validators.required, Validators.min(0), Validators.max(20)]],
      initialAmount: [0],
      priority: ['media', Validators.required],
      description: [''],
      taxExemption: [0]
    });
  }

  ngOnInit(): void {
    // Cargar metas existentes (ejemplo)
    this.goals = [
      {
        id: '1',
        goalName: 'Viaje de Vacaciones',
        targetAmount: 500000,
        duration: 2,
        interestRate: 3.5,
        initialAmount: 50000,
        priority: 'media',
        description: 'Viaje de vacaciones para diciembre 2025',
        createdAt: new Date('2025-12-20'),
        progress: 10,
        monthlySavings: 18500,
        totalSavings: 50000,
        totalInterest: 15000,
        yearlySavings: 222000
      },
      {
        id: '2',
        goalName: 'Entrada para Casa',
        targetAmount: 5000000,
        duration: 5,
        interestRate: 4.0,
        initialAmount: 500000,
        priority: 'alta',
        description: 'Ahorrar para la entrada de una casa',
        createdAt: new Date('2025-01-15'),
        progress: 25,
        monthlySavings: 75000,
        totalSavings: 1250000,
        totalInterest: 300000,
        yearlySavings: 900000
      }
    ];
  }

  calculateGoal(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      const targetAmount = formValue.targetAmount;
      const duration = formValue.duration;
      const interestRate = formValue.interestRate / 100;
      const initialAmount = formValue.initialAmount || 0;
      const taxExemption = formValue.taxExemption / 100;

      // Cálculo del interés compuesto
      const effectiveInterestRate = interestRate * (1 - taxExemption);
      const futureValue = targetAmount;
      const presentValue = initialAmount;
      
      // Fórmula para calcular el pago mensual necesario
      const monthlyRate = effectiveInterestRate / 12;
      const numberOfPayments = duration * 12;
      
      let monthlySavings = 0;
      if (monthlyRate > 0) {
        monthlySavings = (futureValue - presentValue * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                        ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / monthlyRate);
      } else {
        monthlySavings = (futureValue - presentValue) / numberOfPayments;
      }

      const totalSavings = monthlySavings * numberOfPayments + initialAmount;
      const totalInterest = futureValue - totalSavings;
      const yearlySavings = monthlySavings * 12;

      this.calculationResult = {
        monthlySavings: Math.max(0, monthlySavings),
        totalSavings: Math.max(0, totalSavings),
        totalInterest: Math.max(0, totalInterest),
        yearlySavings: Math.max(0, yearlySavings)
      };
    }
  }

  saveGoal(): void {
    if (this.calculationResult && this.goalForm.valid) {
      const formValue = this.goalForm.value;
      const newGoal: FinancialGoal = {
        id: Date.now().toString(),
        goalName: formValue.goalName,
        targetAmount: formValue.targetAmount,
        duration: formValue.duration,
        interestRate: formValue.interestRate,
        initialAmount: formValue.initialAmount || 0,
        priority: formValue.priority,
        description: formValue.description,
        createdAt: new Date(),
        progress: formValue.initialAmount ? 
          (formValue.initialAmount / formValue.targetAmount * 100) : 0,
        monthlySavings: this.calculationResult.monthlySavings,
        totalSavings: this.calculationResult.totalSavings,
        totalInterest: this.calculationResult.totalInterest,
        yearlySavings: this.calculationResult.yearlySavings
      };

      this.goals.unshift(newGoal);
      this.calculationResult = null;
      this.goalForm.reset({
        priority: 'media',
        taxExemption: 0,
        initialAmount: 0
      });
    }
  }

  openModal(): void {
    this.showModal = true;
    this.editingGoal = null;
    this.goalForm.reset({
      priority: 'media',
      taxExemption: 0,
      initialAmount: 0
    });
  }

  editGoal(goal: FinancialGoal): void {
    this.editingGoal = goal;
    this.showModal = true;
    this.goalForm.patchValue({
      goalName: goal.goalName,
      targetAmount: goal.targetAmount,
      duration: goal.duration,
      interestRate: goal.interestRate,
      initialAmount: goal.initialAmount || 0,
      priority: goal.priority,
      description: goal.description
    });
  }

  deleteGoal(goal: FinancialGoal): void {
    if (confirm('¿Estás seguro de que quieres eliminar este objetivo?')) {
      this.goals = this.goals.filter(g => g.id !== goal.id);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingGoal = null;
    this.goalForm.reset();
  }

  calculateMonthlySavings(goal: FinancialGoal): number {
    const targetAmount = goal.targetAmount;
    const duration = goal.duration;
    const interestRate = goal.interestRate / 100;
    const initialAmount = goal.initialAmount || 0;
    
    // Cálculo del interés compuesto
    const monthlyRate = interestRate / 12;
    const numberOfPayments = duration * 12;
    
    let monthlySavings = 0;
    if (monthlyRate > 0) {
      monthlySavings = (targetAmount - initialAmount * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                      ((Math.pow(1 + monthlyRate, numberOfPayments) - 1) / monthlyRate);
    } else {
      monthlySavings = (targetAmount - initialAmount) / numberOfPayments;
    }
    
    return Math.max(0, monthlySavings);
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      
      // Calcular el ahorro mensual
      const monthlySavings = this.calculateMonthlySavings({
        targetAmount: formValue.targetAmount,
        duration: formValue.duration,
        interestRate: formValue.interestRate,
        initialAmount: formValue.initialAmount || 0,
        progress: 0,
        createdAt: new Date(),
        goalName: formValue.goalName,
        priority: formValue.priority,
        description: formValue.description
      });
      
      if (this.editingGoal) {
        // Actualizar objetivo existente
        const index = this.goals.findIndex(g => g.id === this.editingGoal?.id);
        if (index !== -1) {
          this.goals[index] = {
            ...this.editingGoal,
            ...formValue,
            progress: formValue.initialAmount ? 
              (formValue.initialAmount / formValue.targetAmount * 100) : 0,
            monthlySavings: monthlySavings
          };
        }
      } else {
        // Crear nuevo objetivo
        const newGoal: FinancialGoal = {
          id: Date.now().toString(),
          ...formValue,
          createdAt: new Date(),
          progress: formValue.initialAmount ? 
            (formValue.initialAmount / formValue.targetAmount * 100) : 0,
          monthlySavings: monthlySavings
        };
        this.goals.unshift(newGoal);
      }
      
      this.closeModal();
    }
  }

  // Función auxiliar para formatear moneda
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }

  // Función auxiliar para formatear fechas
  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  }
}
