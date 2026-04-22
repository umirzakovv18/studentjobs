// src/app/services/job.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  id: number;
  title: string;
  description: string;
  job_type: 'internship' | 'part_time' | 'full_time' | 'freelance';
  salary?: number;
  location: string;
  is_active: boolean;
  company: number;
  company_name: string;
  created_by_name: string;
  created_at: string;
}

export interface Application {
  id: number;
  job: number;
  job_title: string;
  cover_letter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
  applied_at: string;
}

@Injectable({ providedIn: 'root' })
export class JobService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  // ── Jobs ──────────────────────────────────────────────────────────────────
  getJobs(jobType?: string): Observable<Job[]> {
    let params = new HttpParams();
    if (jobType) params = params.set('job_type', jobType);
    return this.http.get<Job[]>(`${this.apiUrl}/jobs/`, { params });
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/jobs/${id}/`);
  }

  createJob(data: Partial<Job>): Observable<Job> {
    return this.http.post<Job>(`${this.apiUrl}/jobs/`, data);
  }

  updateJob(id: number, data: Partial<Job>): Observable<Job> {
    return this.http.put<Job>(`${this.apiUrl}/jobs/${id}/`, data);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/jobs/${id}/`);
  }

  // ── Applications ──────────────────────────────────────────────────────────
  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/`);
  }

  applyToJob(jobId: number, coverLetter: string): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications/`, {
      job: jobId,
      cover_letter: coverLetter,
    });
  }
}
