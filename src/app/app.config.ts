 import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // НОВЕ: Імпортуємо налаштування для HTTP-запитів

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // НОВЕ: Вмикаємо можливість робити мережеві запити
  ]
};
