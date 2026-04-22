// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '',          redirectTo: 'jobs', pathMatch: 'full' },
  { path: 'login',     loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'register',  loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'jobs',      loadComponent: () => import('./pages/jobs/jobs.component').then(m => m.JobsComponent),        canActivate: [AuthGuard] },
  { path: 'jobs/:id',  loadComponent: () => import('./pages/job-detail/job-detail.component').then(m => m.JobDetailComponent), canActivate: [AuthGuard] },
  { path: 'profile',   loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'my-applications', loadComponent: () => import('./pages/applications/applications.component').then(m => m.ApplicationsComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'jobs' },
];
