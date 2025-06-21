import { Component, OnInit } from '@angular/core';
import { NgIf, NgClass, CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface Card {
  id: number;
  type: string;
  lastFourDigits: string;
  fullNumber: string;
  expiry: string;
  name: string;
  company: string;
  bgColor: string;
  chipColor: string;
  waveColor: string;
  logo: string; // Para el logo de Visa/MasterCard
  cvv: string;
}

@Component({
  selector: 'app-tarjetas',
  standalone: true,
  imports: [NgIf, NgClass, FormsModule, CommonModule],
  templateUrl: './tarjetas.component.html',
  styleUrl: './tarjetas.component.scss'
})
export class TarjetasComponent implements OnInit {
  cards: Card[] = [];

  currentCard: Card;
  showNumbers: boolean = false;
  cardBlocked: boolean = false;
  private timeoutId: any;

  showAddCardForm: boolean = false;
  showCardSelectionPanel: boolean = false;
  newCard: Partial<Card> = {
    name: '',
    fullNumber: '',
    expiry: '',
    cvv: '',
  };
  
  constructor(private sanitizer: DomSanitizer) {
    console.log('TarjetasComponent cargado correctamente!');
    this.currentCard = {
      id: 0,
      type: 'Cargando Tarjeta',
      fullNumber: '****************',
      lastFourDigits: '****',
      expiry: 'MM/AA',
      name: 'CARGANDO...',
      company: '',
      bgColor: '#cccccc',
      chipColor: '#aaaaaa',
      waveColor: '#999999',
      logo: ''
    } as Card;
  }

  ngOnInit(): void {
    this.loadCards();
    if (this.cards.length > 0) {
      this.currentCard = this.cards[0];
    } else {
      this.currentCard = {
        id: 0,
        type: 'No hay tarjetas',
        fullNumber: '****************',
        lastFourDigits: '****',
        expiry: 'MM/AA',
        name: 'AGREGAR TARJETA',
        company: '',
        bgColor: '#eeeeee',
        chipColor: '#dddddd',
        waveColor: '#bbbbbb',
        logo: ''
      } as Card;
    }
  }

  private loadCards(): void {
    const storedCards = localStorage.getItem('paypalCards');
    if (storedCards) {
      this.cards = JSON.parse(storedCards);
    } else {
      this.cards = [
        {
          id: 1,
          type: 'Visa Empresarial',
          lastFourDigits: '9010',
          fullNumber: '4000123456789010',
          expiry: '12/20',
          name: 'C. ARIAS',
          company: 'NOMBRE DE EMPRESA',
          bgColor: '#1a438d',
          chipColor: '#a8a8a8',
          waveColor: '#3366cc',
          logo: 'VISA',
          cvv: ''
        },
        {
          id: 2,
          type: 'MasterCard Clásica',
          lastFourDigits: '1098',
          fullNumber: '5000987654321098',
          expiry: '05/25',
          name: 'JUAN PEREZ',
          company: 'MI EMPRESA',
          bgColor: '#4a4a4a',
          chipColor: '#cccccc',
          waveColor: '#666666',
          logo: 'MASTERCARD',
          cvv: ''
        }
      ];
    }
  }

  private saveCards(): void {
    localStorage.setItem('paypalCards', JSON.stringify(this.cards));
  }

  changeCard(): void {
    this.toggleCardSelectionPanel();
  }

  viewNumbers(): void {
    this.showNumbers = true;
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.showNumbers = false;
      this.timeoutId = null;
    }, 60000);
  }

  toggleBlockCard(): void {
    this.cardBlocked = !this.cardBlocked;
  }

  toggleAddCardForm(): void {
    this.showAddCardForm = !this.showAddCardForm;
    if (!this.showAddCardForm) {
      this.newCard = {
        name: '',
        fullNumber: '',
        expiry: '',
        cvv: '',
      };
    }
  }

  toggleCardSelectionPanel(): void {
    this.showCardSelectionPanel = !this.showCardSelectionPanel;
  }

  selectCard(card: Card): void {
    this.currentCard = card;
    this.saveCards();
    this.toggleCardSelectionPanel();
  }

  addNewCard(): void {
    if (!this.newCard.name || !this.newCard.fullNumber || !this.newCard.expiry || !this.newCard.cvv) {
      alert('Por favor, rellena todos los campos de la tarjeta.');
      return;
    }

    let cardType = '';
    let logo = '';
    let bgColor = '#000000';
    let chipColor = '#a8a8a8';
    let waveColor = '#333333';

    const cardNumberDigits = this.newCard.fullNumber.replace(/\s/g, '');
    if (cardNumberDigits.startsWith('4')) {
      cardType = 'Visa';
      logo = 'VISA';
      bgColor = '#1a438d';
      chipColor = '#a8a8a8';
      waveColor = '#3366cc';
    } else if (cardNumberDigits.startsWith('5')) {
      cardType = 'MasterCard';
      logo = 'MASTERCARD';
      bgColor = '#4a4a4a';
      chipColor = '#cccccc';
      waveColor = '#666666';
    } else {
      alert('Tipo de tarjeta no reconocido (Solo Visa o MasterCard por ahora).');
      return;
    }

    const newCardData: Card = {
      id: this.cards.length > 0 ? Math.max(...this.cards.map(c => c.id)) + 1 : 1,
      type: cardType,
      lastFourDigits: cardNumberDigits.slice(-4),
      fullNumber: cardNumberDigits.match(/.{1,4}/g)!.join(' '),
      expiry: this.newCard.expiry,
      name: this.newCard.name.toUpperCase(),
      company: 'USUARIO',
      bgColor: bgColor,
      chipColor: chipColor,
      waveColor: waveColor,
      logo: logo,
      cvv: this.newCard.cvv
    };

    this.cards.push(newCardData);
    this.saveCards();
    this.currentCard = newCardData;
    this.toggleAddCardForm();
    alert('Tarjeta agregada con éxito!');
  }

  getCardSvg(): SafeHtml {
    const svg = `
      <svg width="300" height="180" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" rx="8" fill="${this.currentCard.bgColor}"/>
        <rect x="30" y="30" width="40" height="30" rx="4" fill="${this.currentCard.chipColor}"/>
        <path d="M0 120 C 75 140, 225 100, 300 120 L 300 180 L 0 180 Z" fill="${this.currentCard.waveColor}" opacity="0.5"/>
        <path d="M0 130 C 75 150, 225 110, 300 130 L 300 180 L 0 180 Z" fill="${this.currentCard.waveColor}" opacity="0.7"/>
        <text x="260" y="160" font-family="Arial" font-size="20" fill="white" text-anchor="end" font-weight="bold">${this.currentCard.logo}</text>
      </svg>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  getCardItemSvg(card: Card): SafeHtml {
    const svg = `
      <svg width="120" height="72" viewBox="0 0 300 180" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="300" height="180" rx="8" fill="${card.bgColor}"/>
        <rect x="30" y="30" width="40" height="30" rx="4" fill="${card.chipColor}"/>
        <text x="260" y="160" font-family="Arial" font-size="20" fill="white" text-anchor="end" font-weight="bold">${card.logo}</text>
      </svg>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
} 