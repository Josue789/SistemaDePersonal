import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { NewWorker } from './pages/new-worker/new-worker';
import { NotFound } from './pages/not-found/not-found';
import { Vacations } from './pages/vacations/vacations';
import { Reports } from './pages/reports/reports';
import { Profile } from './pages/profile/profile';
import { Settings } from './pages/settings/settings';
import { Login } from './pages/login/login';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: () => {
      const auth = inject(AuthService);
      return auth.isTrabajador() ? '/profile' : '/home';
    },
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
  },
  {
    path: 'new-worker',
    component: NewWorker,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Admin'] },
  },
  {
    path: 'new-worker/:id',
    component: NewWorker,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Admin'] },
  },
  {
    path: 'vacations',
    component: Vacations,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Jefe de area', 'Admin'] },
  },
  {
    path: 'reports',
    component: Reports,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Jefe de area', 'Admin'] },
  },
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    component: Settings,
    canActivate: [authGuard],
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'not-found',
    component: NotFound,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
