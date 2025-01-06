from django.db import models

# Create your models here.
from account.models import CustomUser


class Wallet(models.Model):
    balance = models.IntegerField()
    user_id = models.OneToOneField(CustomUser,on_delete=models.CASCADE,related_name='user_wallet')

    def __str__(self):
        return self.user_id.first_name

class WalletTransaction(models.Model):
    date  = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    amount = models.IntegerField()
    wallet_id = models.ForeignKey(Wallet,on_delete=models.CASCADE,related_name="transactions")

    def __str__(self):
        return self.wallet_id.user_id.first_name