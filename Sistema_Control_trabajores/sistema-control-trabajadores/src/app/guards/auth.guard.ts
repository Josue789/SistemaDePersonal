import { inject } from '@angular/core';
import { CanMatchFn, Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Condición sencilla temporal: Verifica si hay 'token' almacenado en localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user) {
    return true; // Permitir el acceso a la ruta
  } else {
    // Si no está el token, forzamos redirección a la pantalla de login
    router.navigate(['/login']);
    return false;
  }
};
