// src/app/pages/applications/applications.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobService, Application } from '../../services/job.service';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <h1>Мои отклики</h1>

      <!-- (click) event #4 — обновить список -->
      <button (click)="loadApplications()">🔄 Обновить</button>

      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
      <div *ngIf="loading">Загрузка...</div>

      <div *ngFor="let app of applications" class="app-card">
        <h3>{{ app.job_title }}</h3>
        <span class="badge" [class]="'status-' + app.status">{{ statusLabel(app.status) }}</span>
        <p *ngIf="app.cover_letter"><em>{{ app.cover_letter }}</em></p>
        <small>Подано: {{ app.applied_at | date: 'dd.MM.yyyy' }}</small>
      </div>

      <p *ngIf="applications.length === 0 && !loading">
        Вы ещё не откликались ни на одну вакансию.
      </p>
    </div>
  `,
})
export class ApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading  = false;
  errorMsg = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  // (click) event #4
  loadApplications(): void {
    this.loading  = true;
    this.errorMsg = '';

    this.jobService.getMyApplications().subscribe({
      next:  (data) => { this.applications = data; this.loading = false; },
      error: ()     => { this.errorMsg = 'Ошибка загрузки откликов'; this.loading = false; },
    });
  }

  statusLabel(status: string): string {
    const map: Record<string, string> = {
      pending:  '⏳ На рассмотрении',
      reviewed: '👀 Просмотрено',
      accepted: '✅ Принято',
      rejected: '❌ Отклонено',
    };
    return map[status] ?? status;
  }
}
