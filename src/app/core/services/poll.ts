// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';  

// @Injectable({
//   providedIn: 'root'
// })
// export class PollService {
//   private apiUrl = 'https://my-backend-server-8hd4.onrender.com/api/surveys';

//   constructor(private http: HttpClient) {}

//   // Додаємо токен лише за наявності
//   private getAuthHeaders(): HttpHeaders {
//     const token = localStorage.getItem('token');
//     let headers = new HttpHeaders();
//     if (token) {
//       headers = headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   }

//   // Головний список тепер зможуть бачити і гості, і залогінені
// //   getPolls(): Observable<any> {
 
// // return this.http.get('https://my-backend-server-8hd4.onrender.com/api/surveys/list');
// //   }
// getPolls(): Observable<any> {
//     // Додаємо { headers: this.getAuthHeaders() }
//     return this.http.get('https://my-backend-server-8hd4.onrender.com/api/surveys/list', { headers: this.getAuthHeaders() });
//   }

 

//   // 👇 ДОДАЄМО НОВИЙ МЕТОД ДЛЯ АДМІНА:
//   getAdminPolls(): Observable<any> {
//     return this.http.get('http://localhost:3000/api/surveys', { headers: this.getAuthHeaders() });
//   }
 
  
// // getPollById(id: string): Observable<any> {
// //     return this.http.get(`https://my-backend-server-8hd4.onrender.com/api/surveys/${id}`, { headers: this.getAuthHeaders() });
// //   }


// getPollById(id: string): Observable<any> {
//   return this.http.get(
//     `http://localhost:3000/api/surveys/${id}`,
//     { headers: this.getAuthHeaders() }
//   );
// }

//   createPoll(data: any): Observable<any> {
//     return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() });
//   }




  
// // Обов'язково переконайтеся, що HttpHeaders імпортовано зверху!
//   // import { HttpHeaders } from '@angular/common/http';

//   // createPoll(pollData: any) {
//   //   // 1. Беремо токен адміна з localStorage
//   //   const token = localStorage.getItem('token');
    
//   //   // 2. Створюємо заголовок
//   //   const headers = new HttpHeaders({
//   //     'Authorization': `Bearer ${token}`
//   //   });

//   //   // 3. Відправляємо POST-запит на бекенд разом із заголовками
//   //   // (Перевірте, щоб адреса збігалася з вашим бекендом)
//   //   return this.http.post('https://my-backend-server-8hd4.onrender.com/api/surveys', pollData, { headers: headers });
//   // }
//   updatePoll(id: string, data: any): Observable<any> {
//     return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() });
//   }

//   deletePoll(id: string): Observable<any> {
//     return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
//   }

//   // vote(pollId: string, optionId: string): Observable<any> {
//   //   return this.http.post(`${this.apiUrl}/${pollId}/vote`, { optionId }, { headers: this.getAuthHeaders() });
//   // }

//   // getMyCompletedSurveys(): Observable<any> {
//   //   return this.http.get(`${this.apiUrl}/my-history`, { headers: this.getAuthHeaders() });
//   // }
// getMyCompletedSurveys(): Observable<any> {
//   // Замінюємо помилковий /my-history на правильний /my/completed
//   return this.http.get(`${this.apiUrl}/my/completed`, { headers: this.getAuthHeaders() });
// }
// // Отримання деталей за публічним ID (тут є варіанти відповідей)
  
  
// // Отримання деталей для голосування (БЕЗ результатів)
//   getPollByPublicId(publicId: string): Observable<any> {
//     return this.http.get(`https://my-backend-server-8hd4.onrender.com/api/surveys/public/${publicId}`, { headers: this.getAuthHeaders() });
//   }

//   // 👇 ДОДАЄМО НОВИЙ МЕТОД ДЛЯ ОТРИМАННЯ ЦИФР (РЕЗУЛЬТАТІВ)
//   getPollResults(publicId: string): Observable<any> {
//     return this.http.get(`https://my-backend-server-8hd4.onrender.com/api/surveys/public/${publicId}/results`, { headers: this.getAuthHeaders() });
//   }
//   // Голосування за публічним ID
//   vote(publicId: string, optionId: string): Observable<any> {
//     // Зверніть увагу: ми змінили адресу на ту, яку ви знайшли на бекенді
//     return this.http.post(`https://my-backend-server-8hd4.onrender.com/api/surveys/public/${publicId}/vote`, { optionId }, { headers: this.getAuthHeaders() });
//   }
//  getMyHistory(): Observable<any> {
//   //   адресу  робочого ендпоінту бекенду
//   return this.http.get('http://localhost:3000/api/surveys/my/completed', { 
//     headers: this.getAuthHeaders() 
//   });
// }
// }



import { Injectable } from '@angular/core'; 
import { HttpClient, HttpHeaders } from '@angular/common/http'; 
import { Observable } from 'rxjs'; 
import { Poll } from '../models/poll.model';
@Injectable({ 
  providedIn: 'root' 
}) 
export class PollService { 
  
  // РОБОЧИЙ РЕЖИМ (для локальних перевірок):
  private apiUrl = 'http://localhost:3000/api/surveys';

  // ПРОДАКШЕН (розкоментувати тільки перед відправкою на Render):
  // private apiUrl = 'https://my-backend-server-8hd4.onrender.com/api/surveys';

  constructor(private http: HttpClient) {}

  // Генерація заголовків із токеном
  private getAuthHeaders(): HttpHeaders { 
    const token = localStorage.getItem('token'); 
    let headers = new HttpHeaders(); 
    if (token) { 
      headers = headers.set('Authorization', `Bearer ${token}`); 
    } 
    return headers; 
  }

  // Головний список для юзерів/гостей
  getPolls(): Observable<Poll> { 
    return this.http.get<Poll>(`${this.apiUrl}/list`, { headers: this.getAuthHeaders() }); 
  }

  // Список для адміна
  
   getAdminPolls(): Observable<Poll[]> { 
  return this.http.get<Poll[]>(this.apiUrl, { 
    headers: this.getAuthHeaders() 
  }); 
} 
  getPollById(id: string): Observable<Poll> { 
    return this.http.get<Poll>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }); 
  }

  createPoll(data: any): Observable<Poll> { 
    return this.http.post(this.apiUrl, data, { headers: this.getAuthHeaders() }); 
  }

  updatePoll(id: string, data: any): Observable<Poll> { 
    return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() }); 
  }

  deletePoll(id: string): Observable<Poll> { 
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }); 
  }

  // getMyCompletedSurveys(): Observable<any> { 
  //   return this.http.get(`${this.apiUrl}/my-history`, { headers: this.getAuthHeaders() }); 
  // }
getMyCompletedSurveys() {
    // Змінюємо помилковий /my-history на правильний /my/completed
    return this.http.get<Poll>(`${this.apiUrl}/my/completed`, { 
      headers: this.getAuthHeaders() 
    });
  }
  // Отримання деталей за публічним ID
  getPollByPublicId(publicId: string): Observable<Poll> { 
    return this.http.get<Poll>(`${this.apiUrl}/public/${publicId}`, { headers: this.getAuthHeaders() }); 
  }
vote(publicId: string, optionId: string): Observable<Poll> {
  return this.http.post(`${this.apiUrl}/public/${publicId}/vote`, { optionId }, { 
    headers: this.getAuthHeaders() 
  });
}

  getPollResults(publicId: string): Observable<Poll> {
  return this.http.get<Poll>(`${this.apiUrl}/public/${publicId}/results`, {
    headers: this.getAuthHeaders()
  });
}
}