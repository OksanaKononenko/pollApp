import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; //   шлях до файлу з AuthService

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};



// import { inject } from '@angular/core'; 
// import { CanActivateFn, Router } from '@angular/router';

// import { AuthService } from '../services/auth';

// // Це функція-охоронець. Angular викличе її ПЕРЕД тим, як пустити на сторінку
// export const authGuard = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   // Якщо користувач є в нашій "пам'яті" - двері відчинені (true)
//   if (authService.getCurrentUser()) {
//     return true;
//   } 
 
//  export const adminGuard: CanActivateFn = () => {
//   const router = inject(Router);
//   const token = localStorage.getItem('token');
//   const role = localStorage.getItem('role');

 
//   // if (token && role === 'admin') {

//   if (token) {
//     return true; // токен є — пускаємо
//   // } else {
//     router.navigate(['/login']); // нема токена — кидаємо на логін .редирект на логінЯкщо ґард не пропускає користувача (наприклад, немає токена), його потрібно перенаправляти //на сторінку авторизаціїЯкщо ґард не пропускає користувача (наприклад, немає токена), його потрібно перенаправляти на сторінку авторизації
 
//     return false;
//   }
// };



 