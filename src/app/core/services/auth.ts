 import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {Router} from '@angular/router'; 
import { inject } from '@angular/core/primitives/di';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Адреса нашого бекенду для авторизації
//  private apiUrl = 'http://localhost:3000/api/auth';  // https://my-backend-server-8hd4.onrender.com/


  private apiUrl = 'https://my-backend-server-8hd4.onrender.com/api/auth';  // https://my-backend-server-8hd4.onrender.com/
private router = inject(Router)
  constructor(private http: HttpClient) {}

  

// 1. Оновлений метод входу
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        // Зберігаємо дані одразу під правильними ключами, як ми домовлялися
        if (response.token) {
          localStorage.setItem('token', response.token);
          const userRole = response.user?.role || 'user';
          localStorage.setItem('role', userRole);
        }
      })
    );
  }


  // Метод для нашого охоронця (AuthGuard), щоб перевіряти, чи ми в системі
  getCurrentUser() {
    return localStorage.getItem('current_user');
  }

   // 2. Оновлений метод отримання токена (для Interceptor-а)
  getToken() {
    // Тепер він віддає правильний новий токен без лапок
    return localStorage.getItem('token')?.replace(/"/g, '')?.trim();
  }


  
logout() {
    // 1. Очищаємо дані
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    
    console.log('Токен після виходу:', localStorage.getItem('token'));
    console.log('Роль після виходу:', localStorage.getItem('role'));

    // 2. Перекидаємо користувача на головну сторінку (або на логін)
    this.router.navigate(['/']); 
  }
 
 

  // 3. Спрощений метод перевірки на адміна
  isAdmin(): boolean {
    // Оскільки ми тепер надійно зберігаємо роль при вході, 
    // нам більше не треба складно розшифровувати токен!
    const role = localStorage.getItem('role')?.replace(/"/g, '')?.trim();
    return role === 'admin';
  }



// Метод для реєстрації нового користувача
 register(email: string, password: string) {
    return this.http.post('https://my-backend-server-8hd4.onrender.com/api/auth/register', { 
      email: email, 
      password: password,
 
    });
  }
     }

 
 




 






