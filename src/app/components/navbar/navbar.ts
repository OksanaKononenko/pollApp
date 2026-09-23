import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // 👈 Додали ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
    
  styleUrls: ['./navbar.css'] 
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private cdr: ChangeDetectorRef // 👈 Підключили примусове оновлення
  ) {}

  ngOnInit() {
    this.updateAuthState();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateAuthState();
      this.cdr.detectChanges(); // 👈 ПРИМУСОВО кажемо Angular оновити кнопки!
    });
  }

  updateAuthState() {
    // Якщо у вашому AuthService немає цих методів, напишіть:
    // this.isLoggedIn = !!localStorage.getItem('token');
    // this.isAdmin = localStorage.getItem('role') === 'admin';
    this.isLoggedIn = !!this.authService.getToken();
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.updateAuthState();
    this.cdr.detectChanges(); // 👈 І тут також оновлюємо миттєво
    this.router.navigate(['/login']);
  }
}