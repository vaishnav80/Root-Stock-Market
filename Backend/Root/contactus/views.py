from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Message,ChatSession
from .serializers import MessageSerializer,ChatSessionSerializer
from account.models import CustomUser
from django.db import models
from rest_framework import status



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