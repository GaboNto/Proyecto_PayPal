import { InjectionToken } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('BaseUrl');
export const ENDPOINTS = {
  base: 'http://localhost:3000/api' // Cambiado para incluir el prefijo global '/api'
};
