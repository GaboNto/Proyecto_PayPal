import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-registro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pre-registro.component.html',
  styleUrls: ['./pre-registro.component.css']
})
export class PreRegistroComponent {
  currentYear: number;

  constructor(private router: Router) {
    this.currentYear = new Date().getFullYear();
  }

  irARegistro(): void {
    this.router.navigate(['/register']);
  }
}
