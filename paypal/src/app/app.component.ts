import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // ⬅️ IMPORTANTE
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ChatBubbleComponent } from "./components/chat-bubble/chat-bubble.component";
import { AuthService } from './services/auth.service';
import { SidebarComponent } from './components/sidebar/sidebar.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, // ⬅️ AGREGA ESTO
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    ChatBubbleComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'paypal';

  constructor(public authService: AuthService) { }
}
