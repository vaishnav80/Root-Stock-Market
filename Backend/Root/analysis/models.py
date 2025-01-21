from django.db import models
from account.models import CustomUser
# Create your models here.


class WatchList(models.Model):

    company = models.CharField(max_length=50)
    symbol = models.CharField(max_length=20)
    user_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

