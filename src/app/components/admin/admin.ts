import { forkJoin } from 'rxjs';
// forkJoin — це оператор RxJS, який дозволяє запустити кілька HTTP-запитів і дочекатися, поки всі вони завершаться.
// щоб вивести варіанти відповідей



import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollService } from '../../core/services/poll';
import { AuthService } from '../../core/services/auth';
import { Poll } from '../../core/models/poll.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'] 
})
export class AdminComponent implements OnInit {
  polls: any[] = [];
  
  currentPage: number = 1;
  itemsPerPage: number = 5;

  isEditMode: boolean = false;
  editingPollId: string | null = null;

  // Змінні для розгортання результатів в адмінці
  expandedPollId: string | null = null;
  expandedPollData: any = null;

  surveyForm = {
    question: '',
    options: [{ text: '' }, { text: '' }]
  };

  constructor(
    private pollService: PollService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadAdminPolls(); 
  }

// loadAdminPolls() {
//   this.pollService.getAdminPolls().subscribe({
//     next: (data: any) => {
//       console.log('API DATA:', data);

//       if (Array.isArray(data)) {
//         this.polls = [...data].reverse();
//       } else {
//         this.polls = [];
//       }

//       console.log('POLLS:', this.polls);
//       this.cdr.detectChanges();
//     },

//     error: (err: any) => {
//       console.error('Помилка завантаження опитувань:', err);
//     }
//   });
// }


// loadAdminPolls() {
//   this.pollService.getAdminPolls().subscribe({
//     // next: (data: any) => {

//     //   console.log('API DATA:', data);

//     //   if (data && Array.isArray(data.surveys)) {
//     //     this.polls = [...data.surveys].reverse();
//     //   } else {
//     //     this.polls = [];
//     //   }

//     //   this.polls.forEach((poll: any) => {
//     //     console.log('Питання:', poll.question);
//     //     console.log('Варіанти:', poll.options);
//     //   });

//     //   this.cdr.detectChanges();
//     // },
// next: (data: any) => {
//   console.log('API DATA:', data);

//   this.polls = Array.isArray(data) ? [...data].reverse() : [];

//   console.log('POLLS:', this.polls);

//   this.cdr.detectChanges();
// },
//     error: (err: any) => {
//       console.error('Помилка завантаження опитувань:', err);
//     }
//   });
// }

// loadAdminPolls() {
//   // Викликаємо правильний адмінський метод
//   this.pollService.getAdminPolls().subscribe({
//     next: (data: any) => {
//       if (data && Array.isArray(data)) {
//         this.polls = [...data].reverse();
//       } else {
//         this.polls = data || [];
//       }
//       this.cdr.detectChanges();
//     },
//     error: (err: any) => console.error('Помилка завантаження опитувань:', err)
//   });
// }

  // loadAdminPolls() {
  //   this.pollService.getAdminPolls().subscribe({
  //     next: (data: any) => {

  //       console.log('🔄 Оновлений список з бекенду:', data.length, 'опитувань'); // 👈 ДОДАЙ ЦЕЙ РЯДОК

  //       if (data && Array.isArray(data)) {
  //         this.polls = [...data].reverse();
  //       } else {
  //         this.polls = data || [];
  //       }
  //       this.cdr.detectChanges();
  //     },
  //     error: (err: any) => console.error('Помилка завантаження опитувань:', err)
  //   });
  // }

// loadAdminPolls() {
//   this.pollService.getAdminPolls().subscribe({
//     next: (data: any) => {
//       // 1. Оновлюємо основний масив
//       if (data && Array.isArray(data)) {
//         this.polls = [...data].reverse();
//       } else {
//         this.polls = data || [];
//       }
      
//       // 2. Геттер paginatedPolls сам підхопить оновлений this.polls,
//       // тому ми просто даємо команду Angular перемалювати екран:
//       this.cdr.detectChanges();
//     },
//     error: (err: any) => console.error('Помилка завантаження опитувань:', err)
//   });
// }

loadAdminPolls() {
  this.pollService.getAdminPolls().subscribe({
    next: (data: Poll[]) => {
      console.log('API DATA:', data);

      const requests = data.map(poll =>
        this.pollService.getPollById(poll.id!)  //! гарантує, що id тут точно існує
      );

      forkJoin(requests).subscribe({
        next: (fullPolls) => {
          console.log('FULL POLLS:', fullPolls);

          this.polls = fullPolls.reverse();

          this.cdr.detectChanges();
        },

        error: (err) => {
          console.error('Помилка отримання деталей опитувань:', err);
        }
      });
    },

    error: (err: any) => {
      console.error('Помилка завантаження опитувань:', err);
    }
  });
}

  get paginatedPolls() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.polls.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.polls.length / this.itemsPerPage) || 1;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  addOptionField() {
    this.surveyForm.options.push({ text: '' });
  }

  removeOptionField(index: number) {
    if (this.surveyForm.options.length > 2) {
      this.surveyForm.options.splice(index, 1);
    } else {
      alert('Опитування повинно мати щонайменше 2 варіанти.');
    }
  }

  editPoll(poll: any) {
    this.isEditMode = true;
    this.editingPollId = poll.id;
    
    this.surveyForm = {
      question: poll.question,
      options: poll.options ? poll.options.map((opt: any) => ({ text: typeof opt === 'string' ? opt : opt.text || opt })) : [{ text: '' }, { text: '' }]
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Метод перегляду результатів для адмінки
// Змінюємо метод: беремо результати прямо з об'єкта опитування, без запиту на сервер
 // Метод перегляду результатів для адмінки
 // Метод перегляду результатів для адмінки із запитом на бекенд
  viewResults(poll: any, forceOpen: boolean = false) {
    if (this.expandedPollId === poll.id && !forceOpen) {
      this.expandedPollId = null;
      this.expandedPollData = null;
      return;
    }

    this.expandedPollId = poll.id;
    
    const pollId = poll.publicId || poll.id;

    // Робимо запит за точними результатами
    this.pollService.getPollResults(pollId).subscribe({
      next: (data: any) => {
        // Дістаємо опції з відповіді бекенду
        let options = data.results || data.options || data.data?.options || poll.options || [];
        
        // Визначаємо загальну кількість голосів
        const totalVotes = data.totalVotes || poll.totalVotes || options.reduce((sum: number, opt: any) => sum + (opt.votesCount || opt.votes || 0), 0);

        // 🧮 РОЗРАХУНОК ВІДСОТКІВ
        options = options.map((opt: any) => {
          const vCount = opt.votesCount || opt.votes || 0; // Враховуємо обидва формати бекенду
          return {
            ...opt,
            votesCount: vCount, // Приводимо до єдиного формату
            percentage: totalVotes > 0 ? Math.round((vCount / totalVotes) * 100) : 0
          };
        });

        this.expandedPollData = {
          options: options,
          totalVotes: totalVotes
        };
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка завантаження результатів в адмінці:', err)
    });
  }

  saveSurvey() {

    console.log('🟢 Кнопка "Зберегти" успішно натиснута!');
    const questionText = this.surveyForm.question.trim();
    if (questionText.length < 5) {
      alert('Питання має містити щонайменше 5 символів!');
      return;
    }

    const validOptions = this.surveyForm.options
      .map(opt => opt.text.trim())
      .filter(text => text !== '');

    if (validOptions.length < 2) {
      alert('Потрібно заповнити хоча б 2 варіанти відповіді!');
      return;
    }

    const payload = {
      question: questionText,
      options: validOptions
    };

    console.log('📦 Дані готові до відправки на бекенд:', payload);



// if (this.isEditMode && this.editingPollId) {
//   console.log('Редагування...');
   
//       this.pollService.updatePoll(this.editingPollId, payload).subscribe({
//         next: () => {
//           alert('Опитування оновлено!');
//           this.resetForm();
//           this.loadAdminPolls();
//         },
//         error: (err: any) => console.error('Помилка оновлення:', err)
//       });
//     } else {

// console.log('Створення нового опитування...');
 



//       this.pollService.createPoll(payload).subscribe({
//         next: () => {
//           alert('Опитування успішно створено!');
//           this.resetForm();
//           this.loadAdminPolls(); 
//           this.currentPage = 1; 
//         },
//         error: (err: any) => console.error('Помилка створення:', err)



// if (this.isEditMode && this.editingPollId) {
//       this.pollService.updatePoll(this.editingPollId, payload).subscribe({
//         next: () => {
//           alert('Опитування оновлено!');
//           this.resetForm();
//           this.loadAdminPolls();
//         },
//         error: (err: any) => console.error('Помилка оновлення:', err)
//       });
//     } else {

  if (this.isEditMode && this.editingPollId) {
      this.pollService.updatePoll(this.editingPollId, payload).subscribe({
        next: (updatedPoll: any) => {
          alert('Опитування оновлено!');
          
          // 🚀 МИТТЄВЕ ОНОВЛЕННЯ ЕКРАНА:
          const index = this.polls.findIndex(p => p.id === this.editingPollId);
          if (index !== -1) {
            // Оновлюємо питання та варіанти прямо в масиві
            this.polls[index].question = payload.question;
            if (updatedPoll && updatedPoll.options) {
              this.polls[index].options = updatedPoll.options;
            }
          }
          
          this.resetForm();
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Помилка оновлення:', err);
          if (err.status === 409) {
            alert('Неможливо відредагувати опитування: у ньому вже є голоси користувачів!');
          }
        }
      });
    } else {
      console.log('🔄 Виклик createPoll полетів у сервіс...');
      this.pollService.createPoll(payload).subscribe({
  //       next: (res: any) => {


 
  //   console.log('✅ Успішне створення бекендом:', res);
  //   alert('Опитування успішно створено!');

  //   this.resetForm();
  //   this.loadAdminPolls(); // 👈 перевірте, чи тут викликається актуальний метод завантаження адмін-списку
  //   this.currentPage = 1; 
  // },
next: (res: any) => {
    console.log('✅ Успішне створення бекендом:', res);
    alert('Опитування успішно створено!');
    
    // 🚀 МИТТЄВЕ ОНОВЛЕННЯ ЕКРАНА:
    // Просто вставляємо нове опитування на самий початок нашого масиву
    this.polls.unshift(res); 
    
    this.resetForm();
    this.currentPage = 1; 
    
    // Примусово кажемо Angular перемалювати екран із новим масивом
    this.cdr.detectChanges(); 
  },




  error: (err: any) => {
          console.error('🔴 Повний об\'єкт помилки створення:', err);
          console.error('Статус помилки:', err.status);
          console.error('Тіло помилки (error body):', err.error);
        }
});
    }
  }



  deletePoll(pollId: string) {
    if (confirm('Ви впевнені, що хочете видалити це опитування назавжди?')) {
      this.pollService.deletePoll(pollId).subscribe({
        next: () => {
          alert('Опитування видалено!');
          // Фільтруємо масив, використовуючи правильну змінну pollId
          this.polls = this.polls.filter(p => p.id !== pollId && p.publicId !== pollId);
          this.cdr.detectChanges();
        },
        error: (err: any) => console.error('Помилка видалення:', err)
      });
    }
  }

//   deletePoll(id: string) {
//     if (confirm('Ви впевнені, що хочете видалити це опитування?')) {
//       this.pollService.deletePoll(id).subscribe({
//         // next: () => {
//         //   this.loadAdminPolls();
//         //   if (this.currentPage > this.totalPages && this.totalPages > 1) {
//         //     this.currentPage = this.totalPages;
//         //   }
//         // },

// next: () => {
//   alert('Опитування видалено!');
//   // Відфільтровуємо видалене опитування з масиву
//   this.polls = this.polls.filter(p => p.id !== pollId && p.publicId !== pollId);
//   this.cdr.detectChanges();
// },

//         error: (err: any) => console.error('Помилка видалення:', err)
//       });
//     }
//   }

  resetForm() {
    this.isEditMode = false;
    this.editingPollId = null;
    this.surveyForm = { question: '', options: [{ text: '' }, { text: '' }] };
  }

  logout() {
    this.authService.logout();
  }
}