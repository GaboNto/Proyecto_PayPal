/**
 * Componente que representa una burbuja de chat flotante.
 * Permite al usuario interactuar con un asistente financiero mediante mensajes.
 * Se comunica con un backend en `http://localhost:3000/api/chatbot`.
 */
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat-bubble.component.html',
  styleUrls: ['./chat-bubble.component.css'],
})
export class ChatBubbleComponent {
    /**
   * Indica si la burbuja de chat está expandida o colapsada.
   */
  isExpanded = true;
  inputMessage = '';
  messages: { text: string; type: 'user' | 'bot' }[] = [];
    /**
   * Inicializa el componente con un mensaje de bienvenida del bot.
   */
  ngOnInit(): void {
    this.messages.push({
      text: '¡Hola! Soy tu asesor financiero. ¿En qué puedo ayudarte hoy?',
      type: 'bot'
    });
  }

  /**
   * Inyección del servicio HttpClient para realizar peticiones al backend.
   * @param http Cliente HTTP usado para enviar y recibir mensajes del bot.
   */
  constructor(private http: HttpClient) { }

  toggleChat() {
    this.isExpanded = !this.isExpanded;
  }
 /**
   * Envía un mensaje del usuario al asistente y maneja la respuesta del backend.
   * Agrega ambos mensajes (usuario y bot) a la conversación.
   */
  sendMessage() {
    const message = this.inputMessage.trim();
    if (!message) return;

    this.messages.push({ text: message, type: 'user' });
    this.inputMessage = '';
    this.scrollToBottom();

    this.http
      .post<{ respuesta: string }>('http://localhost:3000/api/chatbot', {
        texto: message,
      })
      .subscribe({
        next: (res) => {
          console.log(res.respuesta)
          const cleanText = res.respuesta.replace(/\*+/g, '');
          this.messages.push({ text: cleanText, type: 'bot' });
          this.scrollToBottom();
        },
        error: () => {
          this.messages.push({
            text: 'Error al comunicarse con el asistente.',
            type: 'bot',
          });
        },
      });
  }
  /**
   * Hace scroll automático al final del contenedor de mensajes.
   * Garantiza que siempre se vea el último mensaje.
   */
  scrollToBottom() {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }
}
