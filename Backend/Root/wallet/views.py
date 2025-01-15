from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .serializers import WalletSerializer,TransactionSerializer
from django.db.models import F


class WalletData(APIView):

    permission_classes =[IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            
            wallet = Wallet.objects.get(user_id=user)
            serializer = WalletSerializer(wallet)
            if serializer:
                
                return Response({
                    "message": "Wallet already exists",
                    "wallet": serializer.data
                }, status=status.HTTP_200_OK)
            
        except Wallet.DoesNotExist:
           
            new_wallet = Wallet.objects.create(balance=100000, user_id=user)
            new_wallet.save()
            serialized_wallet = WalletSerializer(new_wallet)
            return Response({
                "message": "Wallet created",
                "wallet": serialized_wallet.data
            }, status=status.HTTP_201_CREATED)
        
    def post(self,request):
        print('sdfsdf')
        user = request.user
        print(user)
        data =  request.data.get('amount')
        print(data)
        wallet = Wallet.objects.get(user_id=user)
        wallet.balance = F('balance') + data
        wallet.save()
        transaction = WalletTransaction.objects.create(description = "Quiz Reward Added" ,amount = data,wallet_id = wallet)
        transaction.save()
        return Response({
                "message": "Wallet created",
                "wallet": "dfd"
            }, status=status.HTTP_201_CREATED)
        
class TransactionData(APIView):
    
    permission_classes =[IsAuthenticated]
    def get(self,request):
        user = request.user
        wallet = Wallet.objects.get(user_id = user)
        transaction = WalletTransaction.objects.filter(wallet_id = wallet)
        serializer = TransactionSerializer(transaction,many= True)
        if serializer:
            return Response({
                "message":"ok",
                "transaction" : serializer.data
            },status=status.HTTP_200_OK)
        return Response({
            "message": "Invalid data provided",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)