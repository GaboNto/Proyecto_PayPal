import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true, // 👈 MUY IMPORTANTE
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
  imports: [CommonModule, FormsModule], // 👈 Habilita ngIf, ngFor, ngClass, ngModel
})
export class ChatbotComponent implements AfterViewChecked, OnInit, OnDestroy {
  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('botAudio') botAudio!: ElementRef<HTMLAudioElement>;

  isOpen = false;
  userMessage = '';
  messages: { from: 'bot' | 'user'; text: string; html?: boolean }[] = [
    {
      from: 'bot',
      text: '¡Hola! 👋 Estoy aquí para ayudarte a encontrar la solución perfecta para tus finanzas. ¿Qué te trae por aquí? 🤔',
    },
  ];

  private shouldScroll = false;
  private shouldPlaySound = false;
  private intervalId: any;
  showNotification = false;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      if (!this.isOpen) {
        this.showNotification = true;
        setTimeout(() => (this.showNotification = false), 10000);
      } else {
        this.messages.push({
          from: 'bot',
          text: '¿Quieres que te ayude a saber más de nosotros?',
        });
        this.shouldScroll = true;
      }
    }, 300000); // 5 minutos
  }

  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  openFromNotification() {
    this.showNotification = false;
    this.toggleChat();
    this.messages.push({
      from: 'bot',
      text: '¿Quieres que te ayude a saber más de nosotros?',
    });
    this.shouldScroll = true;
  }

  toggleChat(event?: Event) {
    if (event) event.stopPropagation();
    this.isOpen = !this.isOpen;
    this.shouldScroll = true;
    this.showNotification = false;
  }

  sendMessage() {
    if (!this.userMessage.trim()) return;
    this.messages.push({ from: 'user', text: this.userMessage });
    this.userMessage = '';
    this.shouldScroll = true;
  }

  handleOption(option: string, event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.messages.push({ from: 'user', text: option });
    let respuesta = '';
    let html = false;

    switch (option) {
      case 'Quiero abrir una cuenta':
        respuesta =
          '¡Genial! Puedes abrir una cuenta desde nuestra página principal o te puedo guiar paso a paso. ¿Te gustaría comenzar ahora? <a href="/register" style="text-decoration:underline;cursor:pointer;color:#2563eb;">Registrarse</a>';
        html = true;
        break;
      case 'Necesito soporte técnico':
        respuesta =
          'Nuestro equipo de soporte está listo para ayudarte. ¿Puedes describir tu problema?';
        break;
      case 'Consultar movimientos':
        respuesta =
          'Para consultar tus movimientos, ingresa a tu panel y selecciona "Movimientos". ¿Necesitas ayuda para encontrarlo?';
        break;
      case 'Hablar con un asesor':
        respuesta =
          'Un asesor se pondrá en contacto contigo en breve. Por favor, espera unos momentos.';
        break;
      default:
        respuesta = '¿En qué más puedo ayudarte?';
    }

    this.messages.push({ from: 'bot', text: respuesta, html });
    this.shouldScroll = true;
    this.shouldPlaySound = true;
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
    if (this.shouldPlaySound) {
      this.playBotSound();
      this.shouldPlaySound = false;
    }
  }

  private scrollToBottom() {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private playBotSound() {
    try {
      if (this.botAudio) {
        this.botAudio.nativeElement.currentTime = 0;
        this.botAudio.nativeElement.play();
      }
    } catch (err) {}
  }
}
