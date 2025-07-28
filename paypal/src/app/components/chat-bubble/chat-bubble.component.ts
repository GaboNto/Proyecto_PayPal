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
  isExpanded = true;
  inputMessage = '';
  messages: { text: string; type: 'user' | 'bot' }[] = [];
  ngOnInit(): void {
    this.messages.push({
      text: '¡Hola! Soy tu asesor financiero. ¿En qué puedo ayudarte hoy?',
      type: 'bot'
    });
  }


  constructor(private http: HttpClient) { }

  toggleChat() {
    this.isExpanded = !this.isExpanded;
  }

  sendMessage() {
    const message = this.inputMessage.trim();
    if (!message) return;

    this.messages.push({ text: message, type: 'user' });
    this.inputMessage = '';
    this.scrollToBottom();

    this.http
      .post<{ respuesta: string }>('http://190.45.118.42:3000/api/chatbot', {
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

  scrollToBottom() {
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages');
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }, 100);
  }
}
