from django.db import models
from account.models import CustomUser
# Create your models here.


class Lesson(models.Model):
    heading = models.CharField(max_length=100)
    order = models.PositiveIntegerField(default=0)
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
    


class Quiz(models.Model):
    question = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.question
    
class Answer(models.Model):
    question_id = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='answers')
    answer_text = models.CharField(max_length=100)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.answer_text
    

class Attended(models.Model):
    question_id = models.ForeignKey(Quiz,on_delete=models.CASCADE)
    user_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now=True)


