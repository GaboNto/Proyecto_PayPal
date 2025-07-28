import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>{{ 'footer.product' | translate }}</h4>
          <ul>
            <li><a href="#">{{ 'footer.sendMoney' | translate }}</a></li>
            <li><a href="#">{{ 'footer.requestMoney' | translate }}</a></li>
            <li><a href="#">{{ 'footer.business' | translate }}</a></li>
            <li><a href="#">{{ 'footer.developers' | translate }}</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>{{ 'footer.company' | translate }}</h4>
          <ul>
            <li><a href="#">{{ 'footer.about' | translate }}</a></li>
            <li><a href="#">{{ 'footer.careers' | translate }}</a></li>
            <li><a href="#">{{ 'footer.press' | translate }}</a></li>
            <li><a href="#">{{ 'footer.investors' | translate }}</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>{{ 'footer.support' | translate }}</h4>
          <ul>
            <li><a href="#">{{ 'footer.help' | translate }}</a></li>
            <li><a href="#">{{ 'footer.contact' | translate }}</a></li>
            <li><a href="#">{{ 'footer.security' | translate }}</a></li>
            <li><a href="#">{{ 'footer.community' | translate }}</a></li>
          </ul>
        </div>
        
        <div class="footer-section language-section">
          <h4>🌐 {{ 'footer.language' | translate }}</h4>
          <div class="language-selector">
            <button 
              class="lang-btn" 
              [class.active]="currentLanguage === 'es'"
              (click)="setLanguage('es')"
              title="Cambiar a Español"
            >
              🇪🇸 {{ 'footer.spanish' | translate }}
            </button>
            <button 
              class="lang-btn" 
              [class.active]="currentLanguage === 'en'"
              (click)="setLanguage('en')"
              title="Change to English"
            >
              🇺🇸 {{ 'footer.english' | translate }}
            </button>
          </div>
          <p class="current-lang">{{ 'footer.currentLanguage' | translate }}: {{ currentLanguage === 'es' ? 'Español' : 'English' }}</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="social-links">
          <a href="#" class="social-link">Facebook</a>
          <a href="#" class="social-link">Twitter</a>
          <a href="#" class="social-link">Instagram</a>
          <a href="#" class="social-link">LinkedIn</a>
        </div>
        <p class="copyright">© 2025 Proyecto PayPal. {{ 'footer.allRightsReserved' | translate }}</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: white;
      padding: 30px 0 20px;
      border-top: 3px solid #4a90e2;
    }
    
    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      padding: 0 20px;
    }
    
    .footer-section h4 {
      color: #4a90e2;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    
    .footer-section ul li {
      margin-bottom: 8px;
    }
    
    .footer-section ul li a {
      color: #e0e0e0;
      text-decoration: none;
      transition: color 0.3s ease;
    }
    
    .footer-section ul li a:hover {
      color: #4a90e2;
    }
    
    .language-section {
      text-align: center;
    }
    
    .language-selector {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 15px 0;
    }
    
    .lang-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      border: 2px solid #4a90e2;
      background: transparent;
      color: white;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
    }
    
    .lang-btn:hover {
      background: #4a90e2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
    }
    
    .lang-btn.active {
      background: #4a90e2;
      border-color: #4a90e2;
      box-shadow: 0 4px 8px rgba(74, 144, 226, 0.4);
      font-weight: 700;
    }
    
    .current-lang {
      font-size: 12px;
      color: #e0e0e0;
      margin-top: 10px;
      font-weight: 500;
    }
    
    .footer-bottom {
      border-top: 1px solid #4a90e2;
      margin-top: 30px;
      padding-top: 20px;
      text-align: center;
    }
    
    .social-links {
      margin-bottom: 15px;
    }
    
    .social-link {
      color: #e0e0e0;
      text-decoration: none;
      margin: 0 15px;
      transition: color 0.3s ease;
    }
    
    .social-link:hover {
      color: #4a90e2;
    }
    
    .copyright {
      font-size: 12px;
      color: #b0b0b0;
      margin: 0;
    }
    
    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
      
      .language-selector {
        flex-direction: row;
        justify-content: center;
      }
      
      .lang-btn {
        padding: 10px 15px;
        font-size: 12px;
      }
    }
  `]
})
export class FooterComponent {
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