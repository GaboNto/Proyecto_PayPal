import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-selector">
      <div class="language-title">🌐 IDIOMA</div>
      <div class="language-buttons">
        <button 
          class="lang-btn" 
          [class.active]="currentLanguage === 'es'"
          (click)="setLanguage('es')"
          title="Cambiar a Español"
        >
          🇪🇸 ESPAÑOL
        </button>
        <button 
          class="lang-btn" 
          [class.active]="currentLanguage === 'en'"
          (click)="setLanguage('en')"
          title="Change to English"
        >
          🇺🇸 ENGLISH
        </button>
      </div>
      <div class="current-lang">Actual: {{ currentLanguage === 'es' ? 'Español' : 'English' }}</div>
    </div>
  `,
  styles: [`
    .language-selector {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-right: 20px;
      background: linear-gradient(135deg, #007bff, #0056b3);
      padding: 15px;
      border-radius: 12px;
      border: 3px solid #ffffff;
      box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
      min-width: 200px;
    }
    
    .language-title {
      font-size: 14px;
      font-weight: bold;
      color: white;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .language-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      width: 100%;
    }
    
    .lang-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 16px;
      border: 2px solid white;
      background: transparent;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      width: 100%;
      text-transform: uppercase;
    }
    
    .lang-btn:hover {
      background: white;
      color: #007bff;
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(255, 255, 255, 0.3);
    }
    
    .lang-btn.active {
      background: white;
      color: #007bff;
      border-color: white;
      box-shadow: 0 4px 8px rgba(255, 255, 255, 0.4);
      font-weight: 700;
    }
    
    .current-lang {
      font-size: 12px;
      color: white;
      margin-top: 8px;
      text-align: center;
      font-weight: 500;
    }
    
    @media (max-width: 768px) {
      .language-selector {
        flex-direction: row;
        min-width: auto;
        padding: 10px;
      }
      
      .language-title {
        margin-bottom: 0;
        margin-right: 10px;
      }
      
      .language-buttons {
        flex-direction: row;
        gap: 5px;
      }
      
      .lang-btn {
        padding: 8px 12px;
        font-size: 12px;
      }
      
      .current-lang {
        margin-top: 0;
        margin-left: 10px;
      }
    }
  `]
})
export class LanguageSelectorComponent {
  currentLanguage: Language = 'es';

  constructor(private languageService: LanguageService) {
    this.languageService.language$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  setLanguage(lang: Language) {
    this.languageService.setLanguage(lang);
  }
} 