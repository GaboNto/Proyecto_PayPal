import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatBubbleComponent } from './chat-bubble.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';

describe('ChatBubbleComponent', () => {
  let component: ChatBubbleComponent;
  let fixture: ComponentFixture<ChatBubbleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBubbleComponent, HttpClientTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatBubbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });



  it('debería mostrar el mensaje de bienvenida del bot al iniciar', () => {
    expect(component.messages.length).toBeGreaterThan(0);
    expect(component.messages[0].text).toContain('¡Hola! Soy tu asesor financiero');
    expect(component.messages[0].type).toBe('bot');
  });

  it('debería alternar el estado expandido al llamar toggleChat()', () => {
    const estadoInicial = component.isExpanded;
    component.toggleChat();
    expect(component.isExpanded).toBe(!estadoInicial);
    component.toggleChat();
    expect(component.isExpanded).toBe(estadoInicial);
  });

  it('debería agregar un mensaje de usuario y limpiar el input al enviar un mensaje', () => {
    component.inputMessage = 'Hola!';
    spyOn(component, 'scrollToBottom');
    spyOn(component['http'], 'post').and.returnValue({ subscribe: () => {} } as any);

    component.sendMessage();

    expect(component.messages[component.messages.length - 1].text).toBe('Hola!');
    expect(component.messages[component.messages.length - 1].type).toBe('user');
    expect(component.inputMessage).toBe('');
    expect(component.scrollToBottom).toHaveBeenCalled();
  });

  it('no debería enviar un mensaje vacío', () => {
    component.inputMessage = '   ';
    const mensajesAntes = component.messages.length;
    component.sendMessage();
    expect(component.messages.length).toBe(mensajesAntes);
  });

  it('debería mostrar el chat expandido por defecto', () => {
    const chatWindow = fixture.debugElement.query(By.css('.chat-window'));
    expect(chatWindow).toBeTruthy();
  });
}); 