import json
from channels.generic.websocket import AsyncWebsocketConsumer # type: ignore
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from account.models import CustomUser
from .models import *
from django.utils import timezone
from channels.db import database_sync_to_async # type: ignore
class CommunityConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            query_string = self.scope['query_string'].decode()
            params = parse_qs(query_string)
            user_id = int(params.get('user_id', [None])[0])
            
            self.user = await sync_to_async(CustomUser.objects.get)(id=user_id)
            print(f"User {self.user.id} connecting to WebSocket")
            
            chat_user = await sync_to_async(ChatUser.objects.get_or_create)(
                user=self.user,
                defaults={'is_online': True, 'last_seen': timezone.now()}
            )
            
            # Add to community group
            self.room_group_name = 'community'
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name   
            )
            
            # Add to personal group
            self.user_group_name = f'user_{self.user.id}'
            await self.channel_layer.group_add(
                self.user_group_name,
                self.channel_name
            )
            print(f"Added user {self.user.id} to personal group {self.user_group_name}")
            
            await self.accept()
            
        except Exception as e:
            print(f"Connect error: {e}")
            return
        
    async def get_user_chats(self):
        try:
            chat_users = await sync_to_async(ChatUser.objects.get)(user=self.user)
            chats = await sync_to_async(list)(
                Chat.objects.filter(members=chat_users)
                .select_related()
                .order_by('-created_at')
                .annotate(
                    last_message=models.Subquery(
                        Message.objects.filter(chat=models.OuterRef('pk'))
                        .order_by('-sent_at')
                        .values('content')[:1]
                    ),
                    last_message_time=models.Subquery(
                        Message.objects.filter(chat=models.OuterRef('pk'))
                        .order_by('-sent_at')
                        .values('sent_at')[:1]
                    )
                )
            )
            

            formatted_chats = []
            for chat in chats:
                chat_data = {
                    'id': chat.id,
                    'name': chat.name,
                    'is_group': chat.is_group,
                    'is_active': chat.is_active,
                    'created_at': chat.created_at.isoformat(),
                    'last_message': chat.last_message if chat.last_message else None,
                    'last_message_time': chat.last_message_time.isoformat() if chat.last_message_time else None,
                    'members': await self.get_chat_members(chat)
                }
                formatted_chats.append(chat_data)
            
            return formatted_chats
            
        except Exception as e:
            print(f"Error fetching chats: {e}")
            import traceback
            traceback.print_exc()
            return []
        
    async def get_chat_members(self, chat):
        members = await sync_to_async(list)(
            chat.members.all()
            .select_related('user')
            .values(
                'user_id',
                'user__first_name',
                'user__last_name',
                'is_online',
                'last_seen'
            )
        )
        return [
            {
                'user_id': member['user_id'],
                'name': f"{member['user__first_name']}".strip(),
                'is_online': member['is_online'],
                'last_seen': member['last_seen'].isoformat() if member['last_seen'] else None
            }
            for member in members
        ]


    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            # print(data,'the data received ')
            if data.get('type') == 'message':
                chat_id = data.get('chat_id')
                content = data.get('content')
                
             
                chat_user = await sync_to_async(ChatUser.objects.get)(user=self.user)
                chat = await sync_to_async(Chat.objects.get)(id=chat_id)
                
                message = await sync_to_async(Message.objects.create)(
                    chat=chat,
                    sender=chat_user,
                    content=content
                )
                chat_members = await sync_to_async(list)(chat.members.exclude(id=chat_user.id))
                for member in chat_members:
                    await sync_to_async(MessageStatus.objects.create)(
                        message=message,
                        chat_user=member,
                        is_delivered=False,
                        is_read=False
                    )
                message_data = {
                    'type': 'message',
                    'chat_id': chat_id,
                    'id': message.id,
                    'content': content,
                    'sender_id': self.user.id,
                    'sender_name': self.user.first_name,
                    'timestamp': timezone.now().isoformat(),
                    'status': 'sent'
                }
                
                

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_message',
                        'message': message_data
                    }
                )

                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'chat_list_update',
                        'chats': chats
                    }
                )
            
            elif data.get('type') == 'status_update':
                message_id = data.get('message_id')
                status_type = data.get('status_type')  
                chat_id = data.get('chat_id')
                # print(data)
               
                message_status = await sync_to_async(MessageStatus.objects.get)(
                    message_id=message_id,
                    chat_user_id=chat_id
                )
                print(message_status)
                if status_type == 'delivered':
                    message_status.is_delivered = True
                    message_status.delivered_at = timezone.now()
                elif status_type == 'read':
                    print('ddddd')
                    message_status.is_delivered = True
                    message_status.is_read = True
                    message_status.delivered_at = timezone.now()
                    message_status.read_at = timezone.now()
                
                await sync_to_async(message_status.save)()
               
                message = await sync_to_async(Message.objects.select_related('sender').get)(id=message_id)
                print(message)
                status_data = {
                    'type': 'status_update',
                    'message_id': message_id,
                    'status_type': status_type,
                    'user_id': self.user.id
                }
                print(status_data)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'status_update',
                        'status': status_data
                    }
                )
            
            elif data.get('type') == 'fetch_messages':
                chat_id = data.get('chat_id')
                messages = await self.get_chat_messages(chat_id)
                await self.send(text_data=json.dumps({
                    'type': 'chat_history',
                    'messages': messages
                }))
            
            elif data.get('type') == 'fetch_chats':
                chats = await self.get_user_chats()
                await self.send(text_data=json.dumps({
                    'type': 'chat_list',
                    'chats': chats
                }))
                
            elif data.get('type') == 'call_offer':
                
                print(data,'offerrrrrr')
                await self.handle_call_offer(data)
            
            elif data.get('type') == 'call_answer':
               
                await self.handle_call_answer(data)
            
            elif data.get('type') == 'ice_candidate':
                
                await self.handle_ice_candidate(data)
            
            elif data.get('type') == 'end_call':
                
                await self.handle_end_call(data)


        except Exception as e:
            print(f"Receive error: {e}")

    async def get_chat_messages(self, chat_id):
        messages = await sync_to_async(list)(
            Message.objects.filter(chat_id=chat_id)
            .select_related('sender', 'sender__user')
            .order_by('sent_at')
            .values(
                'id',
                'content',
                'sent_at',
                'sender_id',
                sender_name=models.F('sender__user__first_name')
            )
        )
        return [
            {
                'id': msg['id'],
                'content': msg['content'],
                'sender_id': msg['sender_id'],
                'sender_name': msg['sender_name'],
                'timestamp': msg['sent_at'].isoformat()
            }
            for msg in messages
        ]

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event['message']))


    async def status_update(self, event):
        await self.send(text_data=json.dumps(event['status']))

    async def signal_message(self, event):
        data = event['data']
        await self.send(text_data=json.dumps(data))

    async def handle_call_offer(self, data):
        try:
            print(data, 'dataaa offer')
            receiver_id = data['receiver_id']
            offer_sdp = data['offer']
            call_type = data['call_type']  
            print(f"Handling call offer to receiver {receiver_id}")
            
            # Get ChatUser objects for both parties
            initiator_chat_user = await sync_to_async(ChatUser.objects.get)(user=self.user)
            
            # Create call record
            call = await database_sync_to_async(Call.objects.create)(
                chat_id=data['chat_id'],
                initiator_id=initiator_chat_user.id,
                call_type=call_type,
                status='ongoing'
            )
            
            # Send to receiver's personal group
            print(f'user_{receiver_id}')
            await self.channel_layer.group_send(
                f'user_{receiver_id}',  # Using User ID for the group name
                {
                    'type': 'webrtc_message',
                    'message': {
                        'type': 'incoming_call',
                        'call_id': call.id,
                        'caller_id': self.user.id,
                        'caller_name': self.user.first_name,
                        'call_type': call_type,
                        'offer': offer_sdp,
                        'chat_id': data['chat_id']
                    }
                }
            )
            print(f"Call offer sent to user_{receiver_id}")
            
        except Exception as e:
            print(f"Error in handle_call_offer: {e}")
    async def handle_call_answer(self, data):
        try:
            caller_id = data['caller_id']
            answer_sdp = data['answer']
            call_id = data['call_id']
            
            print(f"Handling call answer from {self.user.id} to caller {caller_id}")
            
            # Update call status if needed
            call = await database_sync_to_async(Call.objects.get)(id=call_id)
            if call.status == 'ongoing':
                call.status = 'connected'
                await database_sync_to_async(call.save)()
            
            await self.channel_layer.group_send(
                f'user_{caller_id}',
                {
                    'type': 'webrtc_message',
                    'message': {
                        'type': 'call_answered',
                        'call_id': call_id,
                        'answer': answer_sdp,
                    }
                }
            )
            print(f"Call answer sent to user_{caller_id}")
            
        except Exception as e:
            print(f"Error in handle_call_answer: {e}")

    async def handle_ice_candidate(self, data):
        try:
            peer_id = data['peer_id']
            candidate = data['candidate']
            
            print(f"Handling ICE candidate from {self.user.id} to peer {peer_id}")
            
            await self.channel_layer.group_send(
                f'user_{peer_id}',
                {
                    'type': 'webrtc_message',
                    'message': {
                        'type': 'ice_candidate',
                        'candidate': candidate,
                        'from_user_id': self.user.id
                    }
                }
            )
            print(f"ICE candidate sent to user_{peer_id}")
            
        except Exception as e:
            print(f"Error in handle_ice_candidate: {e}")
    async def handle_end_call(self, data):
        try:
            call_id = data['call_id']
            peer_id = data['peer_id']
            
            print(f"Handling call end from {self.user.id} to peer {peer_id}")
            
            # Update call record
            call = await database_sync_to_async(Call.objects.get)(id=call_id)
            call.status = 'completed'
            call.ended_at = timezone.now()
            await database_sync_to_async(call.save)()
            
            # Notify peer
            await self.channel_layer.group_send(
                f'user_{peer_id}',
                {
                    'type': 'webrtc_message',
                    'message': {
                        'type': 'call_ended',
                        'call_id': call_id,
                        'ended_by_user_id': self.user.id
                    }
                }
            )
            print(f"Call end notification sent to user_{peer_id}")
            
        except Exception as e:
            print(f"Error in handle_end_call: {e}")
    
    async def disconnect(self, close_code):
        try:
            # Remove from both groups
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            await self.channel_layer.group_discard(
                f'user_{self.user.id}',
                self.channel_name
            )
            print(f"User {self.user.id} disconnected")
            
        except Exception as e:
            print(f"Error in disconnect: {e}")

            
    async def webrtc_message(self, event):
        print(event['message'],'receiverrr')
        await self.send(text_data=json.dumps(event['message']))