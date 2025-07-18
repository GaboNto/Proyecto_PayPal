// Importamos los módulos necesarios
import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';

// Decorador del componente con selector, plantilla y estilos asociados
@Component({
  selector: 'app-ventajas', // Nombre para usar en otros templates si fuera necesario
  templateUrl: './ventajas.component.html', // Ruta al archivo HTML
  styleUrls: ['./ventajas.component.css']   // Ruta al archivo CSS
})
export class VentajasComponent implements AfterViewInit {

  // Inyectamos ElementRef para acceder al DOM del componente
  constructor(private el: ElementRef) {}

  // Se ejecuta después de que la vista está completamente inicializada (ideal para trabajar con el DOM)
  ngAfterViewInit(): void {
    // Seleccionamos todas las tarjetas que usen la clase .feature-card
    const cards: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.feature-card');

    // Creamos un IntersectionObserver para detectar cuándo las tarjetas entran en pantalla
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        const target = entry.target as HTMLElement;

        // Si el elemento es visible (intersecta con el viewport)
        if (entry.isIntersecting) {
          target.classList.add('show');     // Activamos la animación de entrada
          observer.unobserve(target);       // Dejamos de observarlo para que no desaparezca al salir
        }
      });
    }, {
      threshold: 0.1 // El 10% del elemento debe ser visible para activar la animación
    });

    // Observamos cada tarjeta por separado
    cards.forEach((card: HTMLElement) => {
      observer.observe(card);
    });
  }
}
