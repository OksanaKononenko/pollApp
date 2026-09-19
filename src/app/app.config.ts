 import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withDebugTracing} from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http'; // НОВЕ: Імпортуємо налаштування для HTTP-запитів

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
       withHashLocation(),
        withDebugTracing()  // НОВЕ: Вмикаємо трасування маршрутизації для налагодження. 
        // детальне логіювання всіх подій роутера (переходи, старти, завершення тощо) у консоль браузера,
      ),
    provideHttpClient() // НОВЕ: Вмикаємо можливість робити мережеві запити
  ]
};
