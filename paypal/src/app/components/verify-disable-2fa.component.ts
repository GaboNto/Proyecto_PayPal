import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-disable-2fa',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="verify-disable-2fa-container">
      <div class="card">
        <div class="card-header">
          <h2>Confirmar desactivación de 2FA</h2>
        </div>
        <div class="card-body">
          <div *ngIf="loading" class="loading">
            <div class="spinner"></div>
            <p>Verificando...</p>
          </div>
          
          <div *ngIf="!loading && success" class="success">
            <div class="success-icon">✓</div>
            <h3>2FA desactivado correctamente</h3>
            <p>{{ message }}</p>
            <button class="btn btn-primary" (click)="goToConfig()">
              Ir a Configuración
            </button>
          </div>
          
          <div *ngIf="!loading && !success" class="error">
            <div class="error-icon">✗</div>
            <h3>Error al desactivar 2FA</h3>
            <p>{{ message }}</p>
            <button class="btn btn-secondary" (click)="goToConfig()">
              Volver a Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .verify-disable-2fa-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f8f9fa;
      padding: 20px;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #003087 0%, #0070ba 100%);
      color: white;
      padding: 30px;
      text-align: center;
    }

    .card-header h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .card-body {
      padding: 40px;
      text-align: center;
    }

    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #0070ba;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .success {
      color: #28a745;
    }

    .success-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .error {
      color: #dc3545;
    }

    .error-icon {
      font-size: 48px;
      margin-bottom: 20px;
    }

    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      margin-top: 20px;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #0070ba;
      color: white;
    }

    .btn-primary:hover {
      background-color: #005ea6;
    }

    .btn-secondary {
      background-color: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #5a6268;
    }

    h3 {
      margin: 20px 0 10px 0;
      font-size: 20px;
    }

    p {
      margin: 10px 0;
      color: #666;
      line-height: 1.5;
    }
  `]
})
export class VerifyDisable2faComponent implements OnInit {
  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute, 
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.post<any>('/api/users/2fa/disable-confirm', { token }).subscribe({
        next: (res) => {
          this.success = true;
          this.message = res.message;
          this.loading = false;
        },
        error: (err) => {
          this.success = false;
          this.message = err.error?.message || 'Error al desactivar 2FA. El enlace puede haber expirado o ser inválido.';
          this.loading = false;
        }
      });
    } else {
      this.success = false;
      this.message = 'Token no proporcionado. Enlace inválido.';
      this.loading = false;
    }
  }

  goToConfig() {
    this.router.navigate(['/configuracion']);
  }
} 