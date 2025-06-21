import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Comprueba si localStorage está disponible (evita errores en SSR)
  if (typeof localStorage === 'undefined') {
    return next(req);
  }
  
  const token = localStorage.getItem('access_token');
  
  if (token) {
    // Clona la petición y añade la cabecera de autorización
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
}; 