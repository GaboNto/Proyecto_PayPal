import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
/**
 * Interceptor HTTP que agrega el token JWT a todas las solicitudes salientes si existe.
 *
 * Este interceptor revisa si existe un token de acceso almacenado en `localStorage`
 * y, en caso afirmativo, lo adjunta en el encabezado `Authorization` de cada petición HTTP.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * Intercepta las solicitudes HTTP y añade el encabezado Authorization con el token JWT.
   *
   * @param request Solicitud HTTP original.
   * @param next Siguiente manejador de la cadena de interceptores.
   * @returns Observable con el evento HTTP modificado.
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
} 