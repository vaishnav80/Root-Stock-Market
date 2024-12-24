from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    
    email = models.EmailField(unique=True)
    first_name = models.CharField(max_length=50) 
    last_name = models.CharField(max_length=50, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    about = models.CharField(max_length=30, blank=True, null=True)
    city = models.CharField(max_length=50,blank=True, null=True)
    
    address = models.TextField(blank=True, null=True)
    
    DISTRICT_CHOICES = [
        ('TVM', 'Thiruvananthapuram'),
        ('KLM', 'Kollam'),
        ('PTA', 'Pathanamthitta'),
        ('ALP', 'Alappuzha'),
        ('KTM', 'Kottayam'),
        ('IDK', 'Idukki'),
        ('EKM', 'Ernakulam'),
        ('TSR', 'Thrissur'),
        ('PKD', 'Palakkad'),
        ('MLP', 'Malappuram'),
        ('KKD', 'Kozhikode'),
        ('WYD', 'Wayanad'),
        ('KNR', 'Kannur'),
        ('KSD', 'Kasaragod'),
    ]
    district = models.CharField(max_length=3, choices=DISTRICT_CHOICES, blank=True, null=True)
    
    STATE_CHOICES = [
        ('KL', 'Kerala'),
        ('TN', 'Tamil Nadu'),
        ('KA', 'Karnataka'),
       
    ]
    state = models.CharField(max_length=2, choices=STATE_CHOICES, blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
 
    image = models.ImageField(
        upload_to='profile_images/', 
        blank=True, 
        null=True,
        help_text="Upload a profile image"
    )

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at'] 

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        """Override save method to ensure email is always lowercase"""
        self.email = self.email.lower()
        super().save(*args, **kwargs)