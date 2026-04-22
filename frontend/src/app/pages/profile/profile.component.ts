// src/app/pages/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Profile {
  university: string;
  major: string;
  grad_year: number | null;
  bio: string;
  resume_url: string;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Мой профиль</h1>

      <div *ngIf="saved" class="success">✅ Профиль сохранён!</div>
      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>

      <!-- ngModel #3 — университет -->
      <label>Университет</label>
      <input [(ngModel)]="profile.university" name="university" placeholder="КБТУ" />

      <!-- ngModel #4 — специальность -->
      <label>Специальность</label>
      <input [(ngModel)]="profile.major" name="major" placeholder="Информационные системы" />

      <label>Год окончания</label>
      <input [(ngModel)]="profile.grad_year" name="grad_year" type="number" placeholder="2026" />

      <label>О себе</label>
      <textarea [(ngModel)]="profile.bio" rows="4" placeholder="Расскажите о себе..."></textarea>

      <label>Ссылка на резюме</label>
      <input [(ngModel)]="profile.resume_url" name="resume_url" placeholder="https://..." />

      <!-- (click) event #3 — сохранить -->
      <button (click)="saveProfile()" [disabled]="loading">
        {{ loading ? 'Сохранение...' : 'Сохранить профиль' }}
      </button>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  profile: Profile = { university: '', major: '', grad_year: null, bio: '', resume_url: '' };
  loading  = false;
  saved    = false;
  errorMsg = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<Profile>('http://localhost:8000/api/profile/').subscribe({
      next:  (data) => (this.profile = data),
      error: ()     => (this.errorMsg = 'Ошибка загрузки профиля'),
    });
  }

  // (click) event #3
  saveProfile(): void {
    this.loading  = true;
    this.saved    = false;
    this.errorMsg = '';

    this.http.put<Profile>('http://localhost:8000/api/profile/', this.profile).subscribe({
      next: (data) => {
        this.profile = data;
        this.saved   = true;
        this.loading = false;
        setTimeout(() => (this.saved = false), 3000);
      },
      error: () => {
        this.errorMsg = 'Ошибка сохранения';
        this.loading  = false;
      },
    });
  }
}
