from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'



class InvestSerializer(serializers.ModelSerializer):
    class Meta :
        model = Investment
        fields = '__all__'