import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="verify-email-container">
      <h2>{{ 'verifyEmail.title' | translate }}</h2>
      <div *ngIf="loading">{{ 'verifyEmail.verifying' | translate }}</div>
      <div *ngIf="!loading && success" class="success">{{ message }}</div>
      <div *ngIf="!loading && !success" class="error">{{ message }}</div>
    </div>
  `,
  styles: [`
    .verify-email-container { max-width: 400px; margin: 40px auto; padding: 32px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; text-align: center; }
    .success { color: green; font-weight: bold; margin-top: 20px; }
    .error { color: #d32f2f; font-weight: bold; margin-top: 20px; }
  `]
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  success = false;
  message = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (token) {
      this.http.get<any>(`/api/auth/verify-email?token=${token}`).subscribe({
        next: (res) => {
          this.success = res.success;
          this.message = res.message;
          this.loading = false;
        },
        error: (err) => {
          this.success = false;
          this.message = err.error?.message || 'verifyEmail.errorVerifying';
          this.loading = false;
        }
      });
    } else {
      this.success = false;
      this.message = 'verifyEmail.tokenNotProvided';
      this.loading = false;
    }
  }
} 