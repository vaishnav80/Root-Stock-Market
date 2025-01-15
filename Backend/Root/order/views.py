from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Order
from .serializers import *
from django.db.models import F
from wallet.models import Wallet,WalletTransaction

class Orders(APIView):

    permission_classes = [IsAuthenticated]

    def post(self,request):
        data = request.data.copy()
        data['user_id'] = request.user.id
        data['totalAmount'] = data['price'] * int(data['quantity'])
        data['action'] = 'buy'
        serializer = OrderSerializer(data = data)
        print(serializer,'order ')
        if serializer.is_valid():
            serializer.save()
            wallet = Wallet.objects.get(user_id = request.user)
            wallet.balance = F('balance')- data['totalAmount']
            wallet.save()
            transaction = WalletTransaction.objects.create(description = "Purchase" ,amount = data['totalAmount'],wallet_id = wallet)
            transaction.save()
            quantity = int(data['quantity'])
            investment , created  = Investment.objects.get_or_create(   
                company = data['company'],
                user_id=request.user.id, 
                defaults={
                        'price' : data['price'],
                        'quantity' : quantity,
                        'user_id' : request.user,
                        'investment_value' : data['totalAmount']
                }
            )
            if not created:
                investment.quantity = F('quantity') + quantity
                investment.price = (F('investment_value')+data['totalAmount'])/(F('quantity') + quantity)
                investment.investment_value = F('investment_value')+data['totalAmount']
                investment.save()
                investment.refresh_from_db()
            return Response({
                "message":"order Registered",
                "order" : serializer.data
            },status=status.HTTP_201_CREATED)
        return Response({
            "message": "Invalid data provided",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request):
        user = request.user
        orders = Order.objects.filter(user_id = user)
        serializer = OrderSerializer(orders,many = True)
        print(serializer)
        if serializer:
            return Response({
                "message":"ok",
                "order" : serializer.data
            },status=status.HTTP_200_OK)
        return Response({
            "message": "Invalid data provided",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
class Investments (APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        invest = Investment.objects.filter(user_id = user)
        serializer = InvestSerializer(invest,many = True)
        if serializer:
            return Response({
                "message":"ok",
                "order" : serializer.data
            },status=status.HTTP_200_OK)
        return Response({
            "message": "Invalid data provided",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)