import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PollService } from '../../core/services/poll';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './poll-list.html'
})
export class PollListComponent implements OnInit {
  polls: any[] = [];
  myHistory: any[] = [];
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  showHistoryView: boolean = false;
  
  selectedOptionId: string | null = null;
  expandedPollId: string | null = null;
  expandedPollData: any = null;
  expandedTab: string = '';

  // Пагінація
  currentPage: number = 1;
  itemsPerPage: number = 5;

  get paginatedPolls() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.polls.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.polls.length / this.itemsPerPage);
  }

  constructor(
    private pollService: PollService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.checkAuth();
    this.loadPolls();
  }

  checkAuth() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

 loadPolls() {
    this.pollService.getPolls().subscribe({
      next: (data: any) => {
        this.polls = Array.isArray(data) ? data : (data.surveys || data.data || []);
        
        // 🔴 ДІАГНОСТИКА: дивимось, що реально прийшло з сервера
        console.log('📡 [Усі опитування від бекенду]:', this.polls);
        
        const votedOnServer = this.polls.filter(p => p.hasVoted);
        console.log('🚩 [Бекенд стверджує, що ви голосували у цих]:', votedOnServer);
        
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Помилка завантаження опитувань:', err)
    });
  }
  
// loadMyHistory() {
//     this.showHistoryView = true;
    
//     // Гібридний фільтр: беремо історію з бекенду (hasVoted) АБО з локального сховища
//     this.myHistory = this.polls.filter(p => {
//       const pollId = p.publicId || p.id;
//       const hasLocalVote = !!localStorage.getItem(`voted_${pollId}`);
      
//       // Якщо бекенд каже, що ви голосували, або є запис у браузері
//       return p.hasVoted || hasLocalVote;
//     }).map(item => {
//       const pollId = item.publicId || item.id;
//       const storedVoteId = localStorage.getItem(`voted_${pollId}`);
      
//       return {
//         ...item,
//         hasVoted: true, // Гарантуємо статус проходження
//         // Беремо ID вибору або з бекенду, або з локального сховища
//         selectedOptionId: item.selectedOptionId || storedVoteId
//       };
//     });
    
//     this.myHistory.forEach(item => {
//       const pollId = item.publicId || item.id;
//       if (!item.options || item.options.length === 0) {
//         this.pollService.getPollResults(pollId).subscribe({
//           next: (data: any) => {
//             item.options = data.results || data.options || data.data?.options || [];
//             this.updateSelectedText(item);
//             this.cdr.detectChanges();
//           },
//           error: () => {
//             this.pollService.getPollByPublicId(pollId).subscribe({
//               next: (fallback: any) => {
//                 item.options = fallback.options || fallback.data?.options || [];
//                 this.updateSelectedText(item);
//                 this.cdr.detectChanges();
//               }
//             });
//           }
//         });
//       } else {
//         this.updateSelectedText(item);
//       }
//     });

//     this.cdr.detectChanges();
//   }

// прибрати логіку читання з localStorage
loadMyHistory() {
    this.showHistoryView = true;
    
    // Звертаємося до сервісу і просто зберігаємо те, що повернув сервер
    this.pollService.getMyHistory().subscribe({
      next: (data: any) => {
        // Сервер може повернути масив напряму, або загорнути його в об'єкт (наприклад, { surveys: [...] })
        this.myHistory = Array.isArray(data) ? data : (data.surveys || data.data || []);
        
        // Оновлюємо екран
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Помилка завантаження історії:', err);
      }
    });
  }

  updateSelectedText(item: any) {
    console.log(`✍️ [updateSelectedText] poll: ${item.publicId}, selectedOptionId: ${item.selectedOptionId}, current selectedOptionText: ${item.selectedOptionText}`, item.options);
    if (item.options && item.selectedOptionId && !item.selectedOptionText) {
      const found = item.options.find((o: any) => 
        String(o.id || o.optionId || o._id || '') === String(item.selectedOptionId)
      );
      console.log(`🎯 [Found option match]:`, found);
      if (found) {
        item.selectedOptionText = found.text || found;
      }
    }
  }
// Функция isUserChoice проверяет, совпадает ли текущий вариант ответа (Opt: "Signals") с тем, который был выбран (Choice: "Component Store")
  isUserChoice(opt: any, item: any): boolean {
    const optId = String(opt.id || opt.optionId || opt._id || '');
    const choiceId = String(item.selectedOptionId || '');
    const optText = String(opt.text || opt).trim();
    const choiceText = String(item.selectedOptionText || '').trim();
    
    const isMatch = !!((choiceId && optId === choiceId) || (choiceText && optText === choiceText));
    // console.log(`🔎 [isUserChoice] Opt: "${optText}" (id:${optId}) vs Choice: "${choiceText}" (id:${choiceId}) => MATCH: ${isMatch}`, { opt, item });  // процесс сравнения вариантов ответа в   pollApp.
    
    return isMatch;
  }
  
  backToList() {
    this.showHistoryView = false;
  }

  logout() {
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.loadPolls();
  }

  trackByPublicId(index: number, item: any): string {
    return item?.publicId || index;
  }

  viewResults(poll: any, tabName: string) {
    if (this.expandedPollId == poll.publicId && this.expandedTab === tabName) {
      this.expandedPollId = null;
      this.expandedPollData = null;
      this.expandedTab = '';
      return;
    }

    this.expandedPollId = poll.publicId;
    this.expandedTab = tabName;
    this.expandedPollData = null;

    if (tabName === 'results') {
      this.pollService.getPollResults(poll.publicId).subscribe({
        next: (data: any) => {
          const options = data.results || data.options || data.data?.options || [];
          this.expandedPollData = { options: options, totalVotes: data.totalVotes || 0 };
          this.cdr.detectChanges();
        },
        error: () => {
          this.pollService.getPollByPublicId(poll.publicId).subscribe({
            next: (fallbackData: any) => {
              const opts = fallbackData.options || fallbackData.data?.options || [];
              this.expandedPollData = { options: opts, totalVotes: fallbackData.totalVotes || poll.totalVotes || 0 };
              this.cdr.detectChanges();
            }
          });
        }
      });
    } else {
      this.pollService.getPollByPublicId(poll.publicId).subscribe({
        next: (data: any) => {
          const opts = data.options || data.data?.options || [];
          this.expandedPollData = { options: opts, totalVotes: data.totalVotes || poll.totalVotes || 0 };
          this.cdr.detectChanges();
        }
      });
    }
  }

  vote(publicId: string, optionId: string | null) {
    if (!optionId) {
      alert('Будь ласка, виберіть варіант відповіді!');
      return;
    }

    this.pollService.vote(publicId, optionId).subscribe({
      next: () => {
        alert('Ваш голос успішно враховано!');
        this.selectedOptionId = null;
        
        const targetPoll = this.polls.find(p => p.publicId === publicId);
        if (targetPoll) {
          targetPoll.hasVoted = true;
          targetPoll.selectedOptionId = optionId;
          localStorage.setItem(`voted_${publicId}`, optionId);
          
          if (this.expandedPollData?.options) {
            targetPoll.options = this.expandedPollData.options;
          }
          
          const chosenOpt = targetPoll.options?.find((o: any) => 
            String(o.id || o.optionId || o._id || '') === String(optionId)
          );
          targetPoll.selectedOptionText = chosenOpt ? (chosenOpt.text || chosenOpt) : optionId;
        }
        
        this.expandedTab = 'results';

        this.pollService.getPollResults(publicId).subscribe({
          next: (data: any) => {
            const options = data.results || data.options || data.data?.options || [];
            this.expandedPollData = {
              options: options,
              totalVotes: data.totalVotes || 0
            };
            if (targetPoll) {
              targetPoll.options = options;
            }
            this.cdr.detectChanges();
          }
        });
      },
      error: (err: any) => {
        console.error('Помилка голосування:', err);
        if (err.status === 409) {
          alert('Ви вже голосували в цьому опитуванні! Повторне голосування заборонено.');
          const targetPoll = this.polls.find(p => p.publicId === publicId);
          if (targetPoll) targetPoll.hasVoted = true;
        } else {
          alert('Не вдалося відправити голос. Можливо, сталася помилка на сервері.');
        }
      }
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.resetExpanded();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.resetExpanded();
    }
  }

  resetExpanded() {
    this.expandedPollId = null;
    this.expandedPollData = null;
    this.expandedTab = '';
  }
}