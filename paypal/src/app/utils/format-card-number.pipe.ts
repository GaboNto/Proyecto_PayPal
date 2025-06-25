import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCardNumber',
  standalone: true
})
export class FormatCardNumberPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    // Agrupa los números en bloques de 4
    return value.replace(/(\d{4})/g, '$1 ').trim();
  }
} 