from django.db import models
from account.models import CustomUser




class ChatSession(models.Model):
    participants = models.ManyToManyField(CustomUser, related_name="chat_sessions")
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=50,default='Demo')
    def __str__(self):
        participant_names = ", ".join([str(user) for user in self.participants.all()])
        return f"Chat between: {participant_names}"

class Message(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="sent_messages",default=0)
    receiver = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="received_messages")
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

