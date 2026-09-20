import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // підстав свій шлях до AuthService

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken() && authService.isAdmin()) {
    return true;
  }

  router.navigate(['/']); // або '/login', якщо хочеш викидати взагалі із системи
  return false;
};