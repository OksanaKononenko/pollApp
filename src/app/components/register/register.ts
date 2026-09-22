//  import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { AuthService } from '../../core/services/auth';

// @Component({
//   selector: 'app-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './register.html'
// })
// export class RegisterComponent {
//   isLoginMode: boolean = false;

// //  registerForm = {
// //     email: '',
// //     password: ''
// //   };
 

//   // Вписуємо тестові дані сюди:
//   registerForm = {
//     email: '2test@gmail.com', // Замініть на реальний email адміна
//     password: 'Password' , // Замініть на реальний пароль



//   };



//   constructor(private authService: AuthService, private router: Router) {}

 
// switchMode() {
//     // 1. Змінюємо режим
//     this.isLoginMode = !this.isLoginMode;
    
//     // 2. Змінюємо адресу в браузері, щоб усе було синхронно
//     if (this.isLoginMode) {
//       this.router.navigate(['/login']);
//     } else {
//       this.router.navigate(['/register']);
//     }
//   }
//   // --------------------------------------
// // onRegister() {
// //     if (!this.registerForm.email || !this.registerForm.password) {
// //       alert('Будь ласка, заповніть усі поля!');
// //       return;
// //     }

// //     // 1. Спочатку реєструємо користувача
// //     this.authService.register(this.registerForm.email, this.registerForm.password).subscribe({
// //       next: () => {
// //         // Реєстрація успішна! 
// //         alert('Реєстрація успішна! Виконуємо вхід...');
        


// // // next: 
// // // (res: any) => {
// // //   if (res.token) {
// // //     localStorage.setItem('token', res.token);
// // //     // Тимчасово примусово записуємо роль адміна для тестування UI
// // //     localStorage.setItem('role', 'admin'); 
    
// // //     this.router.navigate(['/admin']);
// // //   }
// // // }





// //         // 2. Одразу автоматично логінимо його з тими ж даними
// //         this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
// //           next: () => {
// //             // Вхід успішний, перекидаємо в кабінет опитувань
// //             this.router.navigate(['/polls']);
// //           },
// //           error: (loginErr) => {
// //             console.error('Помилка автоматичного входу:', loginErr);
// //             // Якщо автологін чомусь не спрацював, просто перемикаємо форму на Вхід
// //             this.router.navigate(['/login']);
// //           }
// //         });
// //       },
// //       error: (err) => {
// //         console.error('Помилка реєстрації:', err);
// //         alert('Не вдалося зареєструватися. Можливо, такий користувач уже існує.');
// //       }
// //     });
// //   }
// // onLogin() {
// //     if (!this.registerForm.email || !this.registerForm.password) {
// //       alert('Будь ласка, введіть email та пароль!');
// //       return;
// //     }

// //     this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
// //       next: (res: any) => {
// // console.log('Відповідь сервера:', res); // Тепер res використовується
// //   alert('Реєстрація успішна!');
// //   this.router.navigate(['/login']);

// //         // 1. Читаємо роль, яку зберіг бекенд/сервіс
// //         const role = localStorage.getItem('role');
        
// //         // 2. Робимо розподіл по кабінетах
// //         if (role === 'admin') {
// //           this.router.navigate(['/admin']); // Адміна — в адмінку
// //         } else {
// //           this.router.navigate(['/polls']); // Юзера — до списку
// //         }
// //       },
// //       error: (err) => {
// //         console.error('Помилка входу:', err);
// //         alert('Помилка входу! Перевірте правильність email та пароля.');
// //       }
// //     });
// //   }
// // ------------------------------------



// onRegister() {
//   if (!this.registerForm.email || !this.registerForm.password) {
//     alert('Будь ласка, заповніть усі поля!');
//     return;
//   }

//   // 1. Спочатку реєструємо користувача
//   this.authService.register(this.registerForm.email, this.registerForm.password).subscribe({
//     next: () => {
//       alert('Реєстрація успішна! Виконуємо вхід...');
      
//       // 2. Одразу автоматично логінимо його з тими ж даними
//       this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
//         next: (res: any) => {
//           // Зберігаємо справжній токен від бекенду
//           if (res?.token) {
//             localStorage.setItem('token', res.token);
//           }
//           // ------------тестування адмінки----------------------
//           // ТИМЧАСОВИЙ ХАК: Примусово записуємо роль адміна для тестування UI
//           localStorage.setItem('role', 'admin'); 
          
//           // Перекидаємо одразу в кабінет адміністратора
//           this.router.navigate(['/admin']);
// // 3. Перевіряємо, що саме записалося в пам'ять
//       // console.log('Збережена роль у localStorage:', localStorage.getItem('role'));
//           // ------------------------------------
//         },
//         error: (loginErr) => {
//           console.error('Помилка автоматичного входу:', loginErr);
//           this.router.navigate(['/login']);
//         }
//       });
//     },
//     error: (err) => {
//       console.error('Помилка реєстрації:', err);
//       alert('Не вдалося зареєструватися. Можливо, такий користувач уже існує.');
//     }
//   });
// }


// onLogin() {
//   if (!this.registerForm.email || !this.registerForm.password) {
//     alert('Пожалуйста, введите email и пароль!');
//     return;
//   }

//   this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
//     next: (res: any) => {
//       console.log('Ответ сервера:', res);

//       // Сохраняем токен/роль при необходимости, если это не делает сервис:
//       if (res?.token) localStorage.setItem('token', res.token);
//       if (res?.role) localStorage.setItem('role', res.role);

//       // Читаем роль из ответа сервера или локального хранилища
//       const role = res?.role || localStorage.getItem('role');
      
//       // Прямой распределительный переход без лишнего /login
//       if (role === 'admin') {
//         this.router.navigate(['/admin']); // Адміна — в адмінку
//       } else {
//         this.router.navigate(['/polls']); // Юзера — до списку
//       }
//     },
//     error: (err) => {
//       console.error('Ошибка входа:', err);
//       alert('Ошибка входа! Проверьте правильность email и пароля.');
//     }
//   });
// }
// }


import { Component, OnInit } from '@angular/core';
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
export class RegisterComponent implements OnInit {
  isLoginMode: boolean = false;

  registerForm = {
    email: '',
    password: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Исправление проблемы с маршрутом: определяем режим по URL
    this.isLoginMode = this.router.url.includes('/login');
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
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

    this.authService.register(this.registerForm.email, this.registerForm.password).subscribe({
      next: () => {
        alert('Реєстрація успішна! Виконуємо вхід...');
        
        // Автоматический вход с сохранением токена
        this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
          next: (res: any) => {
            // Обязательно сохраняем данные, иначе guard заблокирует переход
            if (res?.token) localStorage.setItem('token', res.token);
            
            const userRole = res?.role || res?.user?.role || 'user';
            localStorage.setItem('role', userRole);

            this.router.navigate(['/polls']);
          },
          error: (loginErr) => {
            console.error('Помилка автоматичного входу:', loginErr);
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

  onLogin() {
    if (!this.registerForm.email || !this.registerForm.password) {
      alert('Пожалуйста, введите email и пароль!');
      return;
    }

    this.authService.login(this.registerForm.email, this.registerForm.password).subscribe({
      next: (res: any) => {
        if (res?.token) localStorage.setItem('token', res.token);
        if (res?.role) localStorage.setItem('role', res.role);

        const role = res?.role || localStorage.getItem('role');
        
        // Убран лишний переход на /login перед распределением по кабинетам
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/polls']);
        }
      },
      error: (err) => {
        console.error('Ошибка входа:', err);
        alert('Ошибка входа! Проверьте правильность email и пароля.');
      }
    });
  }
}