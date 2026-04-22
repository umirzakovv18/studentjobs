from django.db import models
from django.contrib.auth.models import User


# ─── Custom Manager ───────────────────────────────────────────────────────────
class ActiveJobManager(models.Manager):
    """Returns only active (non-expired) job postings."""
    def get_queryset(self):
        return super().get_queryset().filter(is_active=True)


# ─── Models ───────────────────────────────────────────────────────────────────

class Company(models.Model):
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    website     = models.URLField(blank=True)
    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='companies')
    created_at  = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Companies'


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('internship', 'Internship'),
        ('part_time',  'Part-time'),
        ('full_time',  'Full-time'),
        ('freelance',  'Freelance'),
    ]

    title       = models.CharField(max_length=300)
    description = models.TextField()
    job_type    = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES, default='internship')
    salary      = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    location    = models.CharField(max_length=200, blank=True)
    is_active   = models.BooleanField(default=True)
    company     = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='jobs')  # FK #1
    created_by  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')      # FK #2
    created_at  = models.DateTimeField(auto_now_add=True)

    # Custom manager
    objects = models.Manager()       # default
    active  = ActiveJobManager()     # only active jobs

    def __str__(self):
        return f"{self.title} @ {self.company.name}"


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending',  'Pending'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    job        = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')  # FK #3
    applicant  = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications') # FK #4
    cover_letter = models.TextField(blank=True)
    status     = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('job', 'applicant')  # can't apply twice

    def __str__(self):
        return f"{self.applicant.username} → {self.job.title}"


class StudentProfile(models.Model):
    user       = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    university = models.CharField(max_length=200, blank=True)
    major      = models.CharField(max_length=200, blank=True)
    grad_year  = models.PositiveIntegerField(null=True, blank=True)
    bio        = models.TextField(blank=True)
    resume_url = models.URLField(blank=True)

    def __str__(self):
        return f"Profile of {self.user.username}"
