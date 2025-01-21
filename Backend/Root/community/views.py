from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import *
from .serializers import *
from account.models import CustomUser
from django.db import models
from rest_framework import status
from account.serializers import UserSerializer


class Chat_user(APIView):
        permission_classes =[ IsAuthenticated]

        def get(self,request):
             
            chat_user = CustomUser.objects.exclude(first_name = 'admin')
            
            serializer = UserSerializer(chat_user,many = True)
            if serializer:
                  return Response({
                        "message" : 'user fetched ',
                        "user" : serializer.data
                  },status=status.HTTP_200_OK)
            
            return Response({
                  "message" : "some error to fetch user",
                
            },status=status.HTTP_400_BAD_REQUEST)
        
class Chat_data(APIView):
      
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            chat_user = ChatUser.objects.get(user=request.user)
            user_chats = Chat.objects.filter(members=chat_user)
            serializer = ChatSerializer(user_chats, many=True, context={'request': request})
            return Response({
                "message": 'Chats fetched successfully',
                "chats": serializer.data
            })

        except ChatUser.DoesNotExist:
            return Response({"error": "User's chat profile does not exist"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)

    def post(self,request):
        print('daaaaa')
        data = request.data.get('data')
        chat_user2 = ChatUser.objects.get(user=request.user)
        print(data)
        if data['group'] == False:
            user = CustomUser.objects.get(id=data['users'][0]['id'])
            chat_user1,create = ChatUser.objects.get_or_create(user=user)
            
            chat = Chat.objects.filter(
                    is_group=False,
                    members=chat_user1
                ).filter(
                    members=chat_user2
                ).distinct()
            print(chat)
            if chat.exists():
                return chat.first()
            else:
                new_chat = Chat.objects.create(is_group=False)
                ChatMember.objects.create(chat_user=chat_user1, chat=new_chat)
                ChatMember.objects.create(chat_user=chat_user2, chat=new_chat)
                return new_chat
        else:
            lst=[]
            for i in data['users']:
                user = CustomUser.objects.get(id=i['id'])
                chat_user,create = ChatUser.objects.get_or_create(user=user)
                lst.append(chat_user)
            new_group = Chat.objects.create(is_group=True,name = data['name'])
            for i in lst:
                if i == chat_user2:
                    ChatMember.objects.create(chat_user = i, chat = new_group,is_admin = True)
                else:
                    ChatMember.objects.create(chat_user = i, chat = new_group)

        return Response({
            'message' : "created"
        },status=status.HTTP_201_CREATED)
                
            
