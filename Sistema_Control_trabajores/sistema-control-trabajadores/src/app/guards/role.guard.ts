import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  
  const user = authService.getUser();
  const expectedRoles = route.data['roles'] as Array<string>;

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  if (!expectedRoles || expectedRoles.includes(user.rol)) {
    return true;
  }

  // Si no tiene permisos, pero es jefe de área o trabajador, redirigir a su lugar permitido
  if (user.rol === 'Trabajador' || user.rol === 'Jefe de area') {
    // Si intenta entrar a algo prohibido, lo mandamos al perfil si es trabajador
    if (user.rol === 'Trabajador') {
        router.navigate(['/profile']);
    } else {
        router.navigate(['/']); // Jefe de área puede estar en inicio
    }
    return false;
  }

  router.navigate(['/login']);
  return false;
};
