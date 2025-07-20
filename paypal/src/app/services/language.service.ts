import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  flag: string;
}

export interface Translations {
  [key: string]: {
    [languageCode: string]: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>('es');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  private translations: Translations = {
    // Navegación
    'dashboard': {
      'es': 'Dashboard',
      'en': 'Dashboard',
      'pt': 'Painel',
      'fr': 'Tableau de bord',
      'de': 'Dashboard'
    },
    'transactions': {
      'es': 'Transacciones',
      'en': 'Transactions',
      'pt': 'Transações',
      'fr': 'Transactions',
      'de': 'Transaktionen'
    },
    'send': {
      'es': 'Enviar',
      'en': 'Send',
      'pt': 'Enviar',
      'fr': 'Envoyer',
      'de': 'Senden'
    },
    'request': {
      'es': 'Solicitar',
      'en': 'Request',
      'pt': 'Solicitar',
      'fr': 'Demander',
      'de': 'Anfordern'
    },
    'settings': {
      'es': 'Configuración',
      'en': 'Settings',
      'pt': 'Configurações',
      'fr': 'Paramètres',
      'de': 'Einstellungen'
    },
    'profile': {
      'es': 'Perfil',
      'en': 'Profile',
      'pt': 'Perfil',
      'fr': 'Profil',
      'de': 'Profil'
    },
    'logout': {
      'es': 'Cerrar Sesión',
      'en': 'Logout',
      'pt': 'Sair',
      'fr': 'Déconnexion',
      'de': 'Abmelden'
    },

    // Configuración
    'personal_info': {
      'es': 'Información Personal',
      'en': 'Personal Information',
      'pt': 'Informações Pessoais',
      'fr': 'Informations Personnelles',
      'de': 'Persönliche Informationen'
    },
    'security': {
      'es': 'Seguridad',
      'en': 'Security',
      'pt': 'Segurança',
      'fr': 'Sécurité',
      'de': 'Sicherheit'
    },
    'preferences': {
      'es': 'Preferencias',
      'en': 'Preferences',
      'pt': 'Preferências',
      'fr': 'Préférences',
      'de': 'Einstellungen'
    },
    'notifications': {
      'es': 'Notificaciones',
      'en': 'Notifications',
      'pt': 'Notificações',
      'fr': 'Notifications',
      'de': 'Benachrichtigungen'
    },
    // Eliminar traducciones y métodos relacionados con configuración regional (regional_settings, language, timezone, currency, language_changed, timezone_changed, currency_changed)

    // Mensajes
    'save_success': {
      'es': 'Guardado correctamente',
      'en': 'Saved successfully',
      'pt': 'Salvo com sucesso',
      'fr': 'Enregistré avec succès',
      'de': 'Erfolgreich gespeichert'
    },
    'save_error': {
      'es': 'Error al guardar',
      'en': 'Error saving',
      'pt': 'Erro ao salvar',
      'fr': 'Erreur lors de l\'enregistrement',
      'de': 'Fehler beim Speichern'
    }
  };

  constructor() {
    // Cargar idioma guardado en localStorage
    const savedLanguage = localStorage.getItem('app_language');
    if (savedLanguage) {
      this.setLanguage(savedLanguage);
    }
  }

  setLanguage(languageCode: string) {
    this.currentLanguageSubject.next(languageCode);
    localStorage.setItem('app_language', languageCode);
    
    // Cambiar el atributo lang del documento
    document.documentElement.lang = languageCode;
    
    // Aplicar dirección del texto si es necesario
    if (languageCode === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value;
  }

  translate(key: string): string {
    const currentLang = this.getCurrentLanguage();
    const translation = this.translations[key];
    
    if (translation && translation[currentLang]) {
      return translation[currentLang];
    }
    
    // Fallback a español si no existe la traducción
    if (translation && translation['es']) {
      return translation['es'];
    }
    
    // Si no existe ninguna traducción, devolver la clave
    return key;
  }
} 