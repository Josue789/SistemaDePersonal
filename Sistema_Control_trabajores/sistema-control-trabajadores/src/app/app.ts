import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sistema-control-trabajadores');
  private router = inject(Router);
  public authService = inject(AuthService);
  isLoggedIn = signal(false);

  constructor() {
    this.isLoggedIn.set(this.authService.isLoggedIn());
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn.set(false);
    this.router.navigate(['/login']);
  }

  getUser() {
    return this.authService.getUser();
  }
}
