import { Routes } from '@angular/router';


// Импорт ваших компонентов
 
// import { ProfileComponent } from './profile/profile '; 
// import { LoginComponent } from './login/login ';
 
import { HomeComponent } from './components/home/home'; // 👈 Додаємо імпорт нової сторінки
import { PollListComponent } from './components/poll-list/poll-list';
import { AdminComponent } from './components/admin/admin';
import { RegisterComponent } from './components/register/register';

// Импорт созданных гардов
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';



export const routes: Routes = [
  // 1. Тепер головна сторінка відкриває наш HomeComponent
  { path: '', component: HomeComponent },
    // 1. Публичный маршрут (без защиты, доступен всем гостям)
  // { path: 'login', component: LoginComponent },


  // 2. Сторінки входу та реєстрації ведуть на вашу спільну форму

    { path: 'login', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
   // 2. Защищенный маршрут для ЛЮБОГО авторизованного пользователя
  // { 
  //   path: 'profile', 
  //   component: ProfileComponent, 
  //   canActivate: [authGuard] // Пустит, если есть токен
  // },


  // 3. Кабінети
  // { path: 'polls', component: PollListComponent },
  // { path: 'admin', component: AdminComponent },
  { path: 'polls', component: PollListComponent, canActivate: [authGuard] },
 
    // 3. Строго защищенный маршрут ТОЛЬКО для администратора
  { path: 'admin', component: AdminComponent, canActivate: [adminGuard] },// Пустит, если есть токен И роль 'admin'

  
  // 4. Якщо ввели щось не те — повертаємо на привітальну сторінку
  { path: '**', redirectTo:''}
];

 



 


 
  

 