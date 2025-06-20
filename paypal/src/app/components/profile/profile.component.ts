import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface UserProfile {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  fecha_nacimiento: string;
  pais: string;
  ciudad: string;
  saldo: {
    amount: number;
  };
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userProfile$: Observable<UserProfile | null> = of(null);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.userProfile$ = this.http.get<UserProfile>('http://localhost:3000/api/users/profile');
  }
}
