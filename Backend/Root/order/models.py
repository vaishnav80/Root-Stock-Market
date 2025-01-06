from django.db import models

# Create your models here.
from account.models import CustomUser

class Order(models.Model):
    company = models.CharField(max_length=50)
    action = models.CharField(max_length=10,default='buy')
    quantity = models.IntegerField()
    price = models.DecimalField(max_digits=20, decimal_places=2)
    totalAmount = models.DecimalField(max_digits=20, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)
    type = models.CharField(max_length=20,null=True,blank=True)
    user_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE)

    def __str__(self):
        return self.company


class Investment(models.Model):
    company = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=20, decimal_places=2)
    quantity = models.IntegerField()
    type = models.CharField(max_length=10,null=True)
    user_id = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    investment_value = models.DecimalField(max_digits=20, decimal_places=2,default=0)

    def __str__(self):
        return self.company