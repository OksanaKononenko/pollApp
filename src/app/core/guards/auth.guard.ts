import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth';

// Це функція-охоронець. Angular викличе її ПЕРЕД тим, як пустити на сторінку
export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Якщо користувач є в нашій "пам'яті" - двері відчинені (true)
  if (authService.getCurrentUser()) {
    return true;
  } 
  
  // Якщо немає - розвертаємо його на сторінку логіну і двері зачинені (false)
  // router.navigate(['']);
 router.navigate(['/login']);  //Якщо ґард не пропускає користувача (наприклад, немає токена), його потрібно перенаправляти //на сторінку авторизаціїЯкщо ґард не пропускає користувача (наприклад, немає токена), його потрібно перенаправляти на сторінку авторизації
  return false;
};