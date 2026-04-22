from django.urls import path
from . import views

urlpatterns = [
    # Auth (FBV)
    path('auth/login/',    views.login_view,    name='login'),
    path('auth/logout/',   views.logout_view,   name='logout'),
    path('auth/register/', views.register_view, name='register'),

    # Jobs (CBV — full CRUD)
    path('jobs/',         views.JobListCreateView.as_view(), name='job-list'),
    path('jobs/<int:pk>/', views.JobDetailView.as_view(),    name='job-detail'),

    # Applications (CBV)
    path('applications/',                          views.ApplicationListCreateView.as_view(), name='applications'),
    path('applications/<int:pk>/status/',          views.ApplicationStatusView.as_view(),     name='application-status'),

    # Companies (CBV)
    path('companies/', views.CompanyListCreateView.as_view(), name='companies'),

    # Profile (CBV)
    path('profile/', views.StudentProfileView.as_view(), name='profile'),
]
