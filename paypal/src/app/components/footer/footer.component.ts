// src/app/footer/footer.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    template: `
    <footer class="footer-container">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Producto</h4>
          <ul>
            <li><a routerLink="/features">Características</a></li>
            <li><a routerLink="/pricing">Precios</a></li>
            <li><a routerLink="/how-it-works">Cómo funciona</a></li>
            <li><a routerLink="/security">Seguridad</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Empresa</h4>
          <ul>
            <li><a routerLink="/about">Sobre Nosotros</a></li>
            <li><a routerLink="/careers">Empleos</a></li>
            <li><a routerLink="/press">Prensa</a></li>
            <li><a routerLink="/partners">Socios</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>Soporte</h4>
          <ul>
            <li><a routerLink="/help">Centro de Ayuda</a></li>
            <li><a routerLink="/contact">Contáctenos</a></li>
            <li><a routerLink="/developers">Desarrolladores</a></li>
            <li><a routerLink="/blog">Blog</a></li>
          </ul>
        </div>

        <div class="footer-section contact-info-section">
          <h4>Contacto</h4>
          <p>Proyecto PayPal</p>
          <p>Arica, Arica y Parinacota, Chile</p>
          <p>Teléfono: +56 9 472830</p>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="social-links">
          <a href="https://facebook.com" target="_blank" class="social-link" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i> Facebook
          </a>
          <a href="https://twitter.com" target="_blank" class="social-link" aria-label="Twitter">
            <i class="fab fa-twitter"></i> Twitter
          </a>
          <a href="https://instagram.com" target="_blank" class="social-link" aria-label="Instagram">
            <i class="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://linkedin.com" target="_blank" class="social-link" aria-label="LinkedIn">
            <i class="fab fa-linkedin-in"></i> LinkedIn
          </a>
        </div>
        <p class="copyright">© 2025 Proyecto PayPal. Todos los derechos reservados.</p>
      </div>
    </footer>
  `,
    styles: [`
    .footer-container {
      background: linear-gradient(135deg, #1e3c72, #2a5298);
      color: white;
      padding: 30px 0 20px;
      border-top: 3px solid #4a90e2;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 30px;
      padding: 0 20px;
    }

    .footer-section h4 {
      color: #4a90e2;
      margin-bottom: 15px;
      font-size: 18px;
      font-weight: bold;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-section ul li {
      margin-bottom: 8px;
    }

    .footer-section ul li a {
      color: #e0e0e0;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-section ul li a:hover {
      color: #4a90e2;
    }

    /* Estilos específicos para la sección de información de contacto, si la agregas */
    .contact-info-section p {
      margin-bottom: 5px;
      font-size: 14px;
      color: #e0e0e0;
    }

    .footer-bottom {
      border-top: 1px solid #4a90e2;
      margin-top: 30px;
      padding-top: 20px;
      text-align: center;
    }

    .social-links {
      margin-bottom: 15px;
    }

    .social-link {
      color: #e0e0e0;
      text-decoration: none;
      margin: 0 15px;
      transition: color 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }

    .social-link:hover {
      color: #4a90e2;
    }

    .copyright {
      font-size: 12px;
      color: #b0b0b0;
      margin: 0;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 20px;
      }
    }
  `]
})
export class FooterComponent {
    // Ya no se necesita el constructor ni los métodos relacionados con el LanguageService
    // ni las propiedades de Observable, ya que la funcionalidad de idioma fue eliminada.
}