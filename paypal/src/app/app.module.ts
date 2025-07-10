import { Component } from '@angular/core';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ChatbotComponent,
    NavbarComponent,
    RouterModule,
  ],
})
export class AppComponent {}
