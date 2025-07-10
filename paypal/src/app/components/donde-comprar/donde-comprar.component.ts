import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  imports: [CommonModule, FormsModule],
  templateUrl: './donde-comprar.component.html',
  styleUrl: './donde-comprar.component.scss'
})
export class DondeComprarComponent {
  
  categorias = [
    { id: 'todos', nombre: 'Todos', icono: '🛒' },
    { id: 'streaming', nombre: 'Streaming', icono: '📺' },
    { id: 'gaming', nombre: 'Gaming', icono: '🎮' },
    { id: 'moda', nombre: 'Moda', icono: '👕' },
    { id: 'tecnologia', nombre: 'Tecnología', icono: '💻' },
    { id: 'viajes', nombre: 'Viajes', icono: '✈️' }
  ];

  categoriaSeleccionada = 'todos';
  terminoBusqueda = '';

  comercios: Comercio[] = [
    // Streaming
    {
      id: 1,
      nombre: 'Netflix',
      categoria: 'streaming',
      logo: '📺',
      descripcion: 'Películas y series en streaming',
      popular: true,
      url: 'https://netflix.com'
    },
    {
      id: 2,
      nombre: 'Spotify',
      categoria: 'streaming',
      logo: '🎵',
      descripcion: 'Música y podcasts',
      popular: true,
      url: 'https://spotify.com'
    },
    {
      id: 3,
      nombre: 'Disney+',
      categoria: 'streaming',
      logo: '🏰',
      descripcion: 'Contenido de Disney, Marvel y Star Wars',
      popular: false,
      url: 'https://disneyplus.com'
    },
    {
      id: 4,
      nombre: 'HBO Max',
      categoria: 'streaming',
      logo: '📺',
      descripcion: 'Series y películas premium',
      popular: false,
      url: 'https://hbomax.com'
    },
    {
      id: 5,
      nombre: 'Amazon Prime',
      categoria: 'streaming',
      logo: '📦',
      descripcion: 'Streaming y envíos gratis',
      popular: false,
      url: 'https://amazon.com/prime'
    },

    // Gaming
    {
      id: 6,
      nombre: 'Steam',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'Plataforma de juegos digitales',
      popular: true,
      url: 'https://store.steampowered.com'
    },
    {
      id: 7,
      nombre: 'PlayStation Store',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'Juegos para PlayStation',
      popular: true,
      url: 'https://store.playstation.com'
    },
    {
      id: 8,
      nombre: 'Xbox Store',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'Juegos para Xbox',
      popular: false,
      url: 'https://xbox.com/games'
    },
    {
      id: 9,
      nombre: 'Nintendo eShop',
      categoria: 'gaming',
      logo: '🎮',
      descripcion: 'Juegos para Nintendo Switch',
      popular: false,
      url: 'https://nintendo.com/eshop'
    },

    // Moda
    {
      id: 10,
      nombre: 'Zara',
      categoria: 'moda',
      logo: '👕',
      descripcion: 'Ropa y accesorios de moda',
      popular: false,
      url: 'https://zara.com'
    },
    {
      id: 11,
      nombre: 'H&M',
      categoria: 'moda',
      logo: '👕',
      descripcion: 'Ropa casual y accesorios',
      popular: false,
      url: 'https://hm.com'
    },
    {
      id: 12,
      nombre: 'Nike',
      categoria: 'moda',
      logo: '👟',
      descripcion: 'Ropa deportiva y calzado',
      popular: true,
      url: 'https://nike.com'
    },
    {
      id: 13,
      nombre: 'Adidas',
      categoria: 'moda',
      logo: '👟',
      descripcion: 'Ropa y calzado deportivo',
      popular: false,
      url: 'https://adidas.com'
    },

    // Tecnología
    {
      id: 14,
      nombre: 'Apple Store',
      categoria: 'tecnologia',
      logo: '🍎',
      descripcion: 'Productos Apple y accesorios',
      popular: false,
      url: 'https://apple.com'
    },
    {
      id: 15,
      nombre: 'Samsung',
      categoria: 'tecnologia',
      logo: '📱',
      descripcion: 'Smartphones y electrónicos',
      popular: true,
      url: 'https://samsung.com'
    },
    {
      id: 16,
      nombre: 'Microsoft Store',
      categoria: 'tecnologia',
      logo: '💻',
      descripcion: 'Software y hardware Microsoft',
      popular: false,
      url: 'https://microsoft.com/store'
    },

    // Viajes
    {
      id: 17,
      nombre: 'Booking.com',
      categoria: 'viajes',
      logo: '🏨',
      descripcion: 'Reservas de hoteles y alojamientos',
      popular: true,
      url: 'https://booking.com'
    },
    {
      id: 18,
      nombre: 'Airbnb',
      categoria: 'viajes',
      logo: '🏠',
      descripcion: 'Alojamientos únicos y experiencias',
      popular: false,
      url: 'https://airbnb.com'
    }
  ];

 
  get comerciosFiltrados(): Comercio[] {
    let comercios = this.comercios;
    
   
    if (this.categoriaSeleccionada !== 'todos') {
      comercios = comercios.filter(comercio => comercio.categoria === this.categoriaSeleccionada);
    }
    
   
    if (this.terminoBusqueda.trim() !== '') {
      const termino = this.terminoBusqueda.toLowerCase().trim();
      comercios = comercios.filter(comercio => 
        comercio.nombre.toLowerCase().includes(termino) ||
        comercio.descripcion.toLowerCase().includes(termino) ||
        comercio.categoria.toLowerCase().includes(termino)
      );
    }
    
    return comercios;
  }

 
  get comerciosPopulares(): Comercio[] {
    if (this.terminoBusqueda.trim() !== '') {
      return []; // No mostrar populares si hay búsqueda activa
    }
    return this.comercios.filter(comercio => comercio.popular);
  }

  
  get nombreCategoriaSeleccionada(): string {
    const categoria = this.categorias.find(c => c.id === this.categoriaSeleccionada);
    return categoria ? categoria.nombre : 'Todos';
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