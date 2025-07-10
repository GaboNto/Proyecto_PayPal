import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LanguageService, Language } from './services/language.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    FormsModule,
    TranslateModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  lang: Language;
  constructor(public languageService: LanguageService) {
    this.lang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(l => this.lang = l);
  }
}
