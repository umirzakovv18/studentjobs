// src/app/pages/job-detail/job-detail.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page" *ngIf="job">
      <a routerLink="/jobs">← Назад</a>
      <h1>{{ job.title }}</h1>
      <p class="company"><strong>{{ job.company_name }}</strong></p>
      <p>{{ job.description }}</p>
      <p *ngIf="job.salary">Зарплата: <strong>{{ job.salary }} ₸</strong></p>
      <p>Тип: {{ job.job_type }}</p>
      <p>Локация: {{ job.location }}</p>

      <!-- Apply form -->
      <div *ngIf="!applied; else appliedMsg">
        <h3>Откликнуться на вакансию</h3>

        <!-- ngModel #2 — сопроводительное письмо -->
        <textarea [(ngModel)]="coverLetter" rows="5"
          placeholder="Напишите сопроводительное письмо..."></textarea>

        <!-- (click) event #2 — отправить отклик -->
        <button (click)="applyToJob()" [disabled]="applyLoading">
          {{ applyLoading ? 'Отправка...' : 'Откликнуться' }}
        </button>
        <div *ngIf="applyError" class="error">{{ applyError }}</div>
      </div>

      <ng-template #appliedMsg>
        <p class="success">✅ Вы уже откликнулись на эту вакансию!</p>
      </ng-template>
    </div>

    <div *ngIf="loading">Загрузка...</div>
    <div *ngIf="loadError" class="error">{{ loadError }}</div>
  `,
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  coverLetter     = '';
  applied         = false;
  loading         = false;
  applyLoading    = false;
  loadError       = '';
  applyError      = '';

  constructor(private route: ActivatedRoute, private jobService: JobService) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;

    this.jobService.getJob(id).subscribe({
      next:  (data) => { this.job = data; this.loading = false; },
      error: ()     => { this.loadError = 'Вакансия не найдена'; this.loading = false; },
    });
  }

  // (click) event #2
  applyToJob(): void {
    if (!this.job) return;
    this.applyLoading = true;
    this.applyError   = '';

    this.jobService.applyToJob(this.job.id, this.coverLetter).subscribe({
      next:  () => { this.applied = true; this.applyLoading = false; },
      error: (err) => {
        this.applyError   = err.error?.non_field_errors?.[0] || 'Ошибка при отклике';
        this.applyLoading = false;
      },
    });
  }
}
