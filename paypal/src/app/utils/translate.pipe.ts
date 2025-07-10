import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(key: string, params?: any): string {
    return this.translate.instant(key, params);
  }
} 