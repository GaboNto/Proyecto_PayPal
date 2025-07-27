import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'es' | 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly STORAGE_KEY = 'lang';
  private languageSubject = new BehaviorSubject<Language>(this.getInitialLang());
  language$ = this.languageSubject.asObservable();

  constructor(private translate: TranslateService) {
    // Configurar idiomas disponibles
    this.translate.addLangs(['es', 'en']);
    this.translate.setDefaultLang('es');
    
    // Establecer idioma inicial
    const initialLang = this.getInitialLang();
    this.translate.use(initialLang);
  }

  private getInitialLang(): Language {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored === 'en' || stored === 'es') return stored;
    // Detectar idioma del navegador
    const nav = navigator.language.slice(0, 2);
    return nav === 'en' ? 'en' : 'es';
  }

  setLanguage(lang: Language) {
    this.languageSubject.next(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.translate.use(lang);
  }

  getLanguage(): Language {
    return this.languageSubject.value;
  }
} 