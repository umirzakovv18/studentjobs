# StudentJobs — Платформа поиска работы для студентов

> Проект по дисциплине Web Development | Angular + Django | КБТУ

## Участники группы
| ФИО | GitHub |
|-----|--------|
| ... | @...   |
| ... | @...   |
| ... | @...   |

---

## Описание проекта

**StudentJobs** — веб-платформа, где студенты могут искать стажировки и подработки,
а работодатели — публиковать вакансии и получать отклики.

---

## Стек технологий

| Часть | Технологии |
|-------|-----------|
| Frontend | Angular 17+, TypeScript, FormsModule |
| Backend | Django 4+, Django REST Framework |
| Auth | Token Authentication (DRF) |
| БД | SQLite (dev) |

---

## Запуск проекта

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install django djangorestframework django-cors-headers
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
ng serve
# Открыть http://localhost:4200
```

---

## Структура проекта

```
studentjobs/
├── backend/
│   ├── jobs/
│   │   ├── models.py        # 4 модели: Company, Job, Application, StudentProfile
│   │   ├── serializers.py   # 2 plain + 4 ModelSerializer
│   │   ├── views.py         # 3 FBV + 6 CBV
│   │   └── urls.py
│   └── config/
│       └── settings.py
└── frontend/
    └── src/app/
        ├── services/
        │   ├── auth.service.ts
        │   └── job.service.ts
        ├── interceptors/
        │   └── auth.interceptor.ts
        ├── guards/
        │   └── auth.guard.ts
        └── pages/
            ├── login/
            ├── register/
            ├── jobs/
            ├── job-detail/
            ├── profile/
            └── applications/
```

---

## Соответствие требованиям

### Frontend (Angular)
| Требование | Реализация |
|-----------|-----------|
| ≥4 click-события | filterJobs(), applyToJob(), saveProfile(), loadApplications() |
| ≥4 ngModel | username, password, coverLetter, university, major, bio, resume_url |
| CSS стили | styles.css + component styles |
| ≥3 named routes | /jobs, /jobs/:id, /profile, /my-applications, /login, /register |
| @for / *ngFor | список вакансий, список откликов |
| @if / *ngIf | conditional rendering повсюду |
| JWT / Token Auth | AuthInterceptor + TokenAuthentication |
| HttpClient Service | AuthService + JobService |
| Error handling | catchError в interceptor + errorMsg в компонентах |

### Backend (Django + DRF)
| Требование | Реализация |
|-----------|-----------|
| ≥4 модели | Company, Job, Application, StudentProfile |
| Custom manager | ActiveJobManager (фильтр активных вакансий) |
| ≥2 ForeignKey | Job→Company, Job→User, Application→Job, Application→User |
| ≥2 plain Serializer | LoginSerializer, ApplicationStatusSerializer |
| ≥2 ModelSerializer | JobSerializer, ApplicationSerializer, CompanySerializer, ProfileSerializer |
| ≥2 FBV | login_view, logout_view, register_view |
| ≥2 CBV | JobListCreateView, JobDetailView, ApplicationListCreateView, ... |
| Token Auth | TokenAuthentication + login/logout endpoints |
| Full CRUD | Job (GET list, GET detail, POST, PUT, DELETE) |
| request.user | created_by=request.user, applicant=request.user |
| CORS | django-cors-headers, CORS_ALLOWED_ORIGINS |
| Postman collection | /postman/StudentJobs.postman_collection.json |
