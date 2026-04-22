// src/app/pages/jobs/jobs.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <h1>Вакансии для студентов</h1>

      <!-- (click) event #1 — фильтр -->
      <div class="filters">
        <button (click)="filterJobs('')">Все</button>
        <button (click)="filterJobs('internship')">Стажировка</button>
        <button (click)="filterJobs('part_time')">Частичная занятость</button>
        <button (click)="filterJobs('freelance')">Фриланс</button>
      </div>

      <!-- ngModel #1 — поиск -->
      <input [(ngModel)]="searchQuery" placeholder="Поиск по названию..." (input)="onSearch()" />

      <div *ngIf="errorMsg" class="error">{{ errorMsg }}</div>
      <div *ngIf="loading">Загрузка...</div>

      <!-- @for / *ngFor -->
      <div class="job-list">
        <div *ngFor="let job of filteredJobs" class="job-card" [routerLink]="['/jobs', job.id]">
          <h3>{{ job.title }}</h3>
          <p class="company">{{ job.company_name }}</p>
          <span class="badge">{{ job.job_type }}</span>
          <p *ngIf="job.salary" class="salary">{{ job.salary }} ₸/мес</p>
          <p class="location">📍 {{ job.location }}</p>
        </div>
        <p *ngIf="filteredJobs.length === 0 && !loading">Вакансии не найдены.</p>
      </div>
    </div>
  `,
})
export class JobsComponent implements OnInit {
  jobs: Job[]         = [];
  filteredJobs: Job[] = [];
  searchQuery         = '';
  loading             = false;
  errorMsg            = '';

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(jobType?: string): void {
    this.loading  = true;
    this.errorMsg = '';

    this.jobService.getJobs(jobType).subscribe({
      next: (data) => {
        this.jobs         = data;
        this.filteredJobs = data;
        this.loading      = false;
      },
      error: (err) => {
        this.errorMsg = 'Ошибка загрузки вакансий';
        this.loading  = false;
      },
    });
  }

  // (click) event #1
  filterJobs(type: string): void {
    this.loadJobs(type || undefined);
  }

  // (input) event — поиск на фронте
  onSearch(): void {
    const q = this.searchQuery.toLowerCase();
    this.filteredJobs = this.jobs.filter(j =>
      j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q)
    );
  }
}
