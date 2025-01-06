from rest_framework import serializers
from .models import Wallet,WalletTransaction

class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wallet
        fields = '__all__'

    
class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = '__all__'