import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth';
import { NavbarComponent } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main style="padding: 20px;">
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
  protected readonly title = signal('pollApp');
  public authService = inject(AuthService);
}