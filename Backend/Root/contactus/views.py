from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message,ChatSession
from .serializers import MessageSerializer,ChatSessionSerializer
from account.models import CustomUser
from django.db import models
from rest_framework import status
# class AdminUserChatView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         admin = CustomUser.objects.filter(is_staff=True).first()  # Assume one admin
#         messages = Message.objects.filter(
#             (models.Q(sender=request.user) & models.Q(receiver=admin)) |
#             (models.Q(sender=admin) & models.Q(receiver=request.user))
#         ).order_by("timestamp")
#         serializer = MessageSerializer(messages, many=True)
#         return Response(serializer.data)


# class SendMessageView(APIView):
#     permission_classes = [IsAuthenticated]

#     def post(self, request):
#         admin = CustomUser.objects.filter(is_staff=True).first()
#         data = {
#             "sender": request.user.id,
#             "receiver": admin.id if request.user != admin else request.data["receiver"],
#             "content": request.data["content"]
#         }
#         serializer = MessageSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)


class Sessions(APIView):
        permission_classes =[ IsAuthenticated]

        def get(self,request):
             
            chat = ChatSession.objects.all()
            print(chat)
            serializer = ChatSessionSerializer(chat,many = True)
            if serializer:
                  return Response({
                        'message' :"fetched ",
                        "data": serializer.data
                  },status=status.HTTP_200_OK)