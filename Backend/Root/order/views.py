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
        print('price')
        data = request.data.copy()

        print('data',data)
        data['user_id'] = request.user.id
        data['totalAmount'] = data['price'] * int(data['quantity'])
        serializer = OrderSerializer(data = data)
        print(serializer,'orders ')
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
    
    def put(self, request):
        data = request.data.copy()
        data['user_id'] = request.user.id
        try:
            price = float(data.get('price', 0))
            quantity = int(data.get('quantity', 0))
            if quantity <= 0:
                return Response({"message": "Quantity must be greater than 0."}, status=status.HTTP_400_BAD_REQUEST)
            data['totalAmount'] = price * quantity
        except (ValueError, KeyError) as e:
            return Response({"message": f"Invalid data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        print(type(data['totalAmount']))

        serializer = OrderSerializer(data=data)
        print(serializer, 'order')

        if serializer.is_valid():
           
            serializer.save()

            try:
                wallet = Wallet.objects.get(user_id=request.user)
                wallet.balance = F('balance') + data['totalAmount']
                wallet.save()
                WalletTransaction.objects.create(
                    description="From sell Added",
                    amount=data['totalAmount'],
                    wallet_id=wallet
                )
                investment = Investment.objects.get(
                    company=data['company'],
                    user_id=request.user.id,
                )
                print(investment.quantity,'quantity')
                if investment.quantity-quantity <=0:
                    investment.delete()
                    return Response({
                        "message": "Order registered and investment entry deleted as quantity became zero.",
                        "order": serializer.data
                    }, status=status.HTTP_201_CREATED)

                investment.quantity = F('quantity') - quantity
                investment.price = (F('investment_value') + data['totalAmount']) / (F('quantity') - quantity)
                investment.investment_value = F('investment_value') - data['totalAmount']
                investment.save()
                investment.refresh_from_db()

            except Wallet.DoesNotExist:
                return Response({"message": "Wallet does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            except Investment.DoesNotExist:
                return Response({"message": "Investment does not exist."}, status=status.HTTP_400_BAD_REQUEST)
            except ZeroDivisionError:
                return Response({"message": "Quantity cannot be zero."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({
                "message": "Order Registered",
                "order": serializer.data
            }, status=status.HTTP_201_CREATED)

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