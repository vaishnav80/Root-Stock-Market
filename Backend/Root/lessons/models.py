from django.db import models

# Create your models here.


class Lesson(models.Model):
    heading = models.CharField(max_length=100)

    def __str__(self):
        return self.heading
    


class Lesson_content(models.Model):

    sub_heading = models.CharField(max_length=50)
    content = models.TextField()
    video_url = models.TextField(blank=True,null=True)
    heading_id = models.ForeignKey(Lesson,on_delete=models.CASCADE,blank=True,null=True)
    image = models.ImageField(upload_to='lesson/',blank=True,null=True)

    def __str__(self):
        return self.sub_heading