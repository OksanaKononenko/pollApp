 import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html'
})
export class RegisterComponent {
  isLoginMode: boolean = false;

 registerForm = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

 
switchMode() {
    // 1. Змінюємо режим
    this.isLoginMode = !this.isLoginMode;
    
    // 2. Змінюємо адресу в браузері, щоб усе було синхронно
    if (this.isLoginMode) {
      this.router.navigate(['/login']);
    } else {
      this.router.navigate(['/register']);
    }
  }
onRegister() {
    if (!this.registerForm.email || !this.registerForm.password) {
      alert('Будь ласка, заповніть усі поля!');
      return;
    }

    // 1. Спочатку реєструємо користувача
    this.authService.register(this.registerForm.email, this.registerForm.password).subscribe({
      next: () => {
        // Реєстрація успішна! 
        alert('Реєстрація успішна! Виконуємо вхід...');
        
        // 2. Одразу автоматично логінимо його з тими ж даними
        this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
          next: () => {
            // Вхід успішний, перекидаємо в кабінет опитувань
            this.router.navigate(['/polls']);
          },
          error: (loginErr) => {
            console.error('Помилка автоматичного входу:', loginErr);
            // Якщо автологін чомусь не спрацював, просто перемикаємо форму на Вхід
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        console.error('Помилка реєстрації:', err);
        alert('Не вдалося зареєструватися. Можливо, такий користувач уже існує.');
      }
    });
  }
// onLogin() {
//     if (!this.registerForm.email || !this.registerForm.password) {
//       alert('Будь ласка, введіть email та пароль!');
//       return;
//     }

//     this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
//       next: (res: any) => {
// console.log('Відповідь сервера:', res); // Тепер res використовується
//   alert('Реєстрація успішна!');
//   this.router.navigate(['/login']);

//         // 1. Читаємо роль, яку зберіг бекенд/сервіс
//         const role = localStorage.getItem('role');
        
//         // 2. Робимо розподіл по кабінетах
//         if (role === 'admin') {
//           this.router.navigate(['/admin']); // Адміна — в адмінку
//         } else {
//           this.router.navigate(['/polls']); // Юзера — до списку
//         }
//       },
//       error: (err) => {
//         console.error('Помилка входу:', err);
//         alert('Помилка входу! Перевірте правильність email та пароля.');
//       }
//     });
//   }


onLogin() {
  if (!this.registerForm.email || !this.registerForm.password) {
    alert('Пожалуйста, введите email и пароль!');
    return;
  }

  this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
    next: (res: any) => {
      console.log('Ответ сервера:', res);

      // Сохраняем токен/роль при необходимости, если это не делает сервис:
      if (res?.token) localStorage.setItem('token', res.token);
      if (res?.role) localStorage.setItem('role', res.role);

      // Читаем роль из ответа сервера или локального хранилища
      const role = res?.role || localStorage.getItem('role');
      
      // Прямой распределительный переход без лишнего /login
      if (role === 'admin') {
        this.router.navigate(['/admin']); // Адміна — в адмінку
      } else {
        this.router.navigate(['/polls']); // Юзера — до списку
      }
    },
    error: (err) => {
      console.error('Ошибка входа:', err);
      alert('Ошибка входа! Проверьте правильность email и пароля.');
    }
  });
}
}