// src/app/pages/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username = '';
  password = '';
  loading  = false;
  errorMsg = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(): void {
    this.loading  = true;
    this.errorMsg = '';

    this.auth.login(this.username, this.password).subscribe({
      next: () => this.router.navigate(['/jobs']),
      error: (err) => {
        this.loading  = false;
        this.errorMsg = err.error?.error || 'Ошибка входа. Проверьте данные.';
      },
    });
  }
}
