from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
from asgiref.sync import sync_to_async
import json
from .models import ChatSession, Message
from account.models import CustomUser
from urllib.parse import parse_qs

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)

        user_id = int(params.get('user_id', [None])[0])
        self.user = await sync_to_async(CustomUser.objects.get)(id=user_id)
        self.admin = await sync_to_async(CustomUser.objects.filter(is_staff=True).first)()

        if self.user.is_authenticated:
            self.session = await self.get_or_create_session(self.user, self.admin)
            self.room_name = f"chat_{self.session.id}"
            self.room_group_name = f"chat_{self.room_name}"
            print(self.room_group_name)
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )

            previous_messages = await self.get_previous_messages()

            await self.accept()

            for message in previous_messages:
                print(message,'ggg')
                await self.send(text_data=json.dumps({
                "message": message.content,
                "receiver": message.receiver_id,
                "timestamp": message.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }))
        else:
            await self.close()


    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        print('dfssd')
        data = json.loads(text_data)
        print(data)
        message_content = data["content"]
        print(message_content)
        sender = data['sender']
        
        if sender !=self.admin.id :
            receiver = self.admin.id
        else:
            receiver = data['receiver']
        message = await self.save_message(receiver, message_content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message.content,
                "receiver_id": receiver,
                "timestamp": message.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            }
        )

    async def chat_message(self, event):
        print(event,'event')
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "receiver": event["receiver_id"],
            "timestamp": event["timestamp"]
        }))

    
    async def get_or_create_session(self, user, admin):

        session = await sync_to_async(ChatSession.objects.filter(participants=user)
                                    .filter(participants=admin)
                                    .distinct()
                                    .first)()
        if not session:
            session = await sync_to_async(ChatSession.objects.create)(name = user.first_name)
            await sync_to_async(session.participants.add)(user, admin)
        return session

    @sync_to_async
    def save_message(self, receiver, content):
        return Message.objects.create(session=self.session, content=content,receiver_id = receiver)

    
    async def get_previous_messages(self):
   
        messages = await sync_to_async(
            lambda: list(
                Message.objects.filter(session=self.session).order_by("timestamp")
            )
        )()
        return messages

