from django.db import models

# Create your models here.


class Lesson(models.Model):
    heading = models.CharField(max_length=100)

    def __str__(self):
        return self.heading
    
