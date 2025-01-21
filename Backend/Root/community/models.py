from django.db import models

from account.models import CustomUser
from django.conf import settings
from django.db import models

class ChatUser(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='chat_profile')
    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(auto_now=True)
    typing_in_chat = models.ForeignKey('Chat', null=True, blank=True, on_delete=models.SET_NULL)
    status = models.CharField(max_length=100, blank=True) 

    def __str__(self):
        return f"{self.user.first_name}'s Ch at Profile"

class Chat(models.Model):
    is_group = models.BooleanField(default=False)
    name = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    members = models.ManyToManyField('ChatUser', through='ChatMember')

class ChatMember(models.Model):
    chat_user = models.ForeignKey(ChatUser, on_delete=models.CASCADE)
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    joined_at = models.DateTimeField(auto_now_add=True)
    is_admin = models.BooleanField(default=False)
    nickname = models.CharField(max_length=50, blank=True)
    is_muted = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ['chat_user', 'chat']

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    sender = models.ForeignKey(ChatUser, on_delete=models.CASCADE)
    content = models.TextField()
    sent_at = models.DateTimeField(auto_now_add=True)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    emoji_reactions = models.JSONField(default=dict)

class MessageStatus(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    chat_user = models.ForeignKey(ChatUser, on_delete=models.CASCADE)
    is_delivered = models.BooleanField(default=False)
    delivered_at = models.DateTimeField(null=True)
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True)

class MediaAttachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE)
    file = models.FileField(upload_to='chat_attachments/')
    file_type = models.CharField(max_length=50)  
    file_size = models.IntegerField()
    thumbnail = models.ImageField(upload_to='chat_thumbnails/', null=True, blank=True)

class Call(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE)
    initiator = models.ForeignKey(ChatUser, on_delete=models.CASCADE, related_name='calls_initiated')
    call_type = models.CharField(max_length=5, choices=[('audio', 'Audio'), ('video', 'Video')])
    started_at = models.DateTimeField(auto_now_add=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=[
        ('ongoing', 'Ongoing'),
        ('missed', 'Missed'),
        ('completed', 'Completed'),
        ('rejected', 'Rejected')
    ])


from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_chat_user(sender, instance, created, **kwargs):
    if created:
        ChatUser.objects.create(user=instance)