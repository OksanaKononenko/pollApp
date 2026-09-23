 


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 👈 Важливо для переходу на /login
import { PollService } from '../../core/services/poll'; // Перевірте правильність шляху

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule], // 👈 Додали RouterModule
  templateUrl: 'home.html',
    
  styleUrls: ['home.css'] 
})
export class HomeComponent implements OnInit {
  polls: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private pollService: PollService) {}

ngOnInit() {
    // Перевіряємо, чи є токен
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token; 

    // РОБИМО ЗАПИТ ТІЛЬКИ ЯКЩО Є ТОКЕН (щоб уникнути помилки 401)
    if (this.isLoggedIn) {
      this.loadPublicPolls();
    }
  }

  loadPublicPolls() {
    this.pollService.getPolls().subscribe({
      next: (data: any) => {
        let resultList = [];
        if (Array.isArray(data)) resultList = data;
        else if (data && Array.isArray(data.polls)) resultList = data.polls;
        else if (data && Array.isArray(data.surveys)) resultList = data.surveys;
        else if (data && Array.isArray(data.data)) resultList = data.data;

        this.polls = [...resultList].reverse();
      },
      error: (err: any) => console.error('Помилка завантаження опитувань:', err)
    });
  }
}