from django.contrib import admin
from .models import Company, Job, Application, StudentProfile

admin.site.register(Company)
admin.site.register(Job)
admin.site.register(Application)
admin.site.register(StudentProfile)