import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home'; // 👈 Додаємо імпорт нової сторінки
import { PollListComponent } from './components/poll-list/poll-list';
import { AdminComponent } from './components/admin/admin';
import { RegisterComponent } from './components/register/register';

export const routes: Routes = [
  // 1. Тепер головна сторінка відкриває наш HomeComponent
  { path: '', component: HomeComponent },
  
  // 2. Сторінки входу та реєстрації ведуть на вашу спільну форму
  { path: 'login', component: RegisterComponent },
  { path: 'register', component: RegisterComponent },
  
  // 3. Кабінети
  { path: 'polls', component: PollListComponent },
  { path: 'admin', component: AdminComponent },
  
  // 4. Якщо ввели щось не те — повертаємо на привітальну сторінку
  { path: '**', redirectTo: '' }
];