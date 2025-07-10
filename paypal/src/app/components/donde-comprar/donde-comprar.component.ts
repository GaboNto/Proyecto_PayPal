import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface Comercio {
  id: number;
  nombre: string;
  categoria: string;
  logo: string;
  descripcion: string;
  popular: boolean;
  url: string;
}

@Component({
  selector: 'app-donde-comprar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './donde-comprar.component.html',
  styleUrl: './donde-comprar.component.scss'
})
export class DondeComprarComponent {
  
  categorias = [
    { id: 'todos', nombre: 'whereToBuy.category.all', icono: '🛒' },
    { id: 'streaming', nombre: 'whereToBuy.category.streaming', icono: '📺' },
    { id: 'gaming', nombre: 'whereToBuy.category.gaming', icono: '🎮' },
    { id: 'moda', nombre: 'whereToBuy.category.fashion', icono: '👕' },
    { id: 'tecnologia', nombre: 'whereToBuy.category.technology', icono: '💻' },
    { id: 'viajes', nombre: 'whereToBuy.category.travel', icono: '✈️' }
  ];

  categoriaSeleccionada = 'todos';
  terminoBusqueda = '';

  comercios: Comercio[] = [
    // Streaming
    {
      id: 1,
      nombre: 'whereToBuy.commerce.netflix',
      categoria: 'streaming',
      logo: '📺',
      descripcion: 'whereToBuy.commerceDesc.netflix',
      popular: true,
      url: 'https://netflix.com'
    },
    {
      id: 2,
      nombre: 'whereToBuy.commerce.spotify',
      categoria: 'streaming',
      logo: '🎵',
      descripcion: 'whereToBuy.commerceDesc.spotify',
      popular: true,
      url: 'https://spotify.com'
    },
    {
      id: 3,
      nombre: 'whereToBuy.commerce.disney',
      categoria: 'streaming',
      logo: '🏰',
      descripcion: 'whereToBuy.commerceDesc.disney',
      popular: false,
      url: 'https://disneyplus.com'
    },
    {
      id: 4,
      nombre: 'whereToBuy.commerce.hbo',
      categoria: 'streaming',
      logo: '📺',
      descripcion: 'whereToBuy.commerceDesc.hbo',
      popular: false,
      url: 'https://hbomax.com'
    },
    {
      id: 5,
      nombre: 'whereToBuy.commerce.amazon',
      categoria: 'streaming',
      logo: '📦',
      descripcion: 'whereToBuy.commerceDesc.amazon',
      popular: false,
      url: 'https://amazon.com/prime'
    },

    // Gaming
    {
      id: 6,
      nombre: 'whereToBuy.commerce.steam',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'whereToBuy.commerceDesc.steam',
      popular: true,
      url: 'https://store.steampowered.com'
    },
    {
      id: 7,
      nombre: 'whereToBuy.commerce.playstation',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'whereToBuy.commerceDesc.playstation',
      popular: true,
      url: 'https://store.playstation.com'
    },
    {
      id: 8,
      nombre: 'whereToBuy.commerce.xbox',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'whereToBuy.commerceDesc.xbox',
      popular: false,
      url: 'https://xbox.com/games'
    },
    {
      id: 9,
      nombre: 'whereToBuy.commerce.nintendo',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'whereToBuy.commerceDesc.nintendo',
      popular: false,
      url: 'https://nintendo.com/eshop'
    },

    // Moda
    {
      id: 10,
      nombre: 'whereToBuy.commerce.zara',
      categoria: 'moda',
      logo: '👕',
      descripcion: 'whereToBuy.commerceDesc.zara',
      popular: false,
      url: 'https://zara.com'
    },
    {
      id: 11,
      nombre: 'whereToBuy.commerce.hm',
      categoria: 'moda',
      logo: '👕',
      descripcion: 'whereToBuy.commerceDesc.hm',
      popular: false,
      url: 'https://hm.com'
    },
    {
      id: 12,
      nombre: 'whereToBuy.commerce.nike',
      categoria: 'moda',
      logo: '👟',
      descripcion: 'whereToBuy.commerceDesc.nike',
      popular: true,
      url: 'https://nike.com'
    },
    {
      id: 13,
      nombre: 'whereToBuy.commerce.adidas',
      categoria: 'moda',
      logo: '👟',
      descripcion: 'whereToBuy.commerceDesc.adidas',
      popular: false,
      url: 'https://adidas.com'
    },

    // Tecnología
    {
      id: 14,
      nombre: 'whereToBuy.commerce.apple',
      categoria: 'tecnologia',
      logo: '🍎',
      descripcion: 'whereToBuy.commerceDesc.apple',
      popular: false,
      url: 'https://apple.com'
    },
    {
      id: 15,
      nombre: 'whereToBuy.commerce.samsung',
      categoria: 'tecnologia',
      logo: '📱',
      descripcion: 'whereToBuy.commerceDesc.samsung',
      popular: true,
      url: 'https://samsung.com'
    },
    {
      id: 16,
      nombre: 'whereToBuy.commerce.microsoft',
      categoria: 'tecnologia',
      logo: '💻',
      descripcion: 'whereToBuy.commerceDesc.microsoft',
      popular: false,
      url: 'https://microsoft.com/store'
    },

    // Viajes
    {
      id: 17,
      nombre: 'whereToBuy.commerce.booking',
      categoria: 'viajes',
      logo: '🏨',
      descripcion: 'whereToBuy.commerceDesc.booking',
      popular: true,
      url: 'https://booking.com'
    },
    {
      id: 18,
      nombre: 'whereToBuy.commerce.airbnb',
      categoria: 'viajes',
      logo: '🏠',
      descripcion: 'whereToBuy.commerceDesc.airbnb',
      popular: true,
      url: 'https://airbnb.com'
    }
  ];

  get comerciosFiltrados(): Comercio[] {
    let comercios = this.comercios;
    
    // Filtrar por categoría
    if (this.categoriaSeleccionada !== 'todos') {
      comercios = comercios.filter(c => c.categoria === this.categoriaSeleccionada);
    }
    
    // Filtrar por término de búsqueda
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase();
      comercios = comercios.filter(c => 
        c.nombre.toLowerCase().includes(termino) ||
        c.descripcion.toLowerCase().includes(termino) ||
        c.categoria.toLowerCase().includes(termino)
      );
    }
    
    return comercios;
  }

  get comerciosPopulares(): Comercio[] {
    return this.comercios.filter(c => c.popular);
  }

  get nombreCategoriaSeleccionada(): string {
    const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
    return categoria ? categoria.nombre : '';
  }

  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  buscarComercios(termino: string) {
    this.terminoBusqueda = termino;
  }

  limpiarBusqueda() {
    this.terminoBusqueda = '';
  }

  visitarComercio(comercio: Comercio) {
    window.open(comercio.url, '_blank');
  }
} 