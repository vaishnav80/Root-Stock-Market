from rest_framework import serializers
from .models import *

class Wishlistserializer(serializers.ModelSerializer):

    class Meta :
        model = WatchList
        fields = '__all__'