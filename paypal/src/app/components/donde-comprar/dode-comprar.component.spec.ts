import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DondeComprarComponent } from './donde-comprar.component';
import { By } from '@angular/platform-browser';

describe('DondeComprarComponent', () => {
  let component: DondeComprarComponent;
  let fixture: ComponentFixture<DondeComprarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DondeComprarComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DondeComprarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('debería mostrar todas las categorías', () => {
    expect(component.categorias.length).toBeGreaterThan(0);
  });

  it('debería filtrar comercios por categoría', () => {
    component.categoriaSeleccionada = 'streaming';
    fixture.detectChanges();
    const filtrados = component.comerciosFiltrados;
    expect(filtrados.every(c => c.categoria === 'streaming')).toBeTrue();
  });

  it('debería filtrar comercios por término de búsqueda', () => {
    component.terminoBusqueda = 'netflix';
    fixture.detectChanges();
    const filtrados = component.comerciosFiltrados;
    expect(filtrados.length).toBeGreaterThan(0);
    expect(filtrados[0].nombre.toLowerCase()).toContain('netflix');
  });

  it('debería limpiar la búsqueda', () => {
    component.terminoBusqueda = 'algo';
    component.limpiarBusqueda();
    expect(component.terminoBusqueda).toBe('');
  });

  it('debería cambiar la categoría seleccionada', () => {
    component.cambiarCategoria('gaming');
    expect(component.categoriaSeleccionada).toBe('gaming');
  });

  it('debería devolver comercios populares solo si no hay búsqueda activa', () => {
    component.terminoBusqueda = '';
    const populares = component.comerciosPopulares;
    expect(populares.every(c => c.popular)).toBeTrue();

    component.terminoBusqueda = 'netflix';
    expect(component.comerciosPopulares.length).toBe(0);
  });

  it('debería devolver el nombre de la categoría seleccionada', () => {
    component.categoriaSeleccionada = 'moda';
    expect(component.nombreCategoriaSeleccionada).toBe('Moda');
  });

  it('debería abrir una nueva ventana al visitar un comercio', () => {
    spyOn(window, 'open');
    const comercio = component.comercios[0];
    component.visitarComercio(comercio);
    expect(window.open).toHaveBeenCalledWith(comercio.url, '_blank');
  });
}); 