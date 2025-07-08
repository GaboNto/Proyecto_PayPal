import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './transactions-public.component';

@Component({
  selector: 'app-transactions-public',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transactions-public.component.html',
  styleUrl: './transactions-public.component.css'
})
export class TransactionsPublicComponent {} 