import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PollService } from '../../core/services/poll';
import { AuthService } from '../../core/services/auth';

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

  loadAdminPolls() {
    this.pollService.getPolls().subscribe({
      next: (data: any) => {
        if (data && Array.isArray(data)) {
          this.polls = [...data].reverse();
        } else {
          this.polls = data || [];
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Помилка завантаження опитувань:', err)
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

    if (this.isEditMode && this.editingPollId) {
      this.pollService.updatePoll(this.editingPollId, payload).subscribe({
        next: () => {
          alert('Опитування оновлено!');
          this.resetForm();
          this.loadAdminPolls();
        },
        error: (err: any) => console.error('Помилка оновлення:', err)
      });
    } else {
      this.pollService.createPoll(payload).subscribe({
        next: () => {
          alert('Опитування успішно створено!');
          this.resetForm();
          this.loadAdminPolls(); 
          this.currentPage = 1; 
        },
        error: (err: any) => console.error('Помилка створення:', err)
      });
    }
  }

  deletePoll(id: string) {
    if (confirm('Ви впевнені, що хочете видалити це опитування?')) {
      this.pollService.deletePoll(id).subscribe({
        next: () => {
          this.loadAdminPolls();
          if (this.currentPage > this.totalPages && this.totalPages > 1) {
            this.currentPage = this.totalPages;
          }
        },
        error: (err: any) => console.error('Помилка видалення:', err)
      });
    }
  }

  resetForm() {
    this.isEditMode = false;
    this.editingPollId = null;
    this.surveyForm = { question: '', options: [{ text: '' }, { text: '' }] };
  }

  logout() {
    this.authService.logout();
  }
}