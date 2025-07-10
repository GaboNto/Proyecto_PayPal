import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';
import { TranslateModule } from '@ngx-translate/core';

export * from './transactions-public.component';

@Component({
  selector: 'app-transactions-public',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './transactions-public.component.html',
  styleUrl: './transactions-public.component.css'
})
export class TransactionsPublicComponent {
  lang: Language;
  constructor(public languageService: LanguageService) {
    this.lang = this.languageService.getLanguage();
    this.languageService.language$.subscribe(l => this.lang = l);
  }
} 