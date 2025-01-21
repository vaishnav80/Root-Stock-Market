from rest_framework import serializers
from .models import Chat, ChatUser

class ChatSerializer(serializers.ModelSerializer):
    members = serializers.StringRelatedField(many=True) 
    name = serializers.SerializerMethodField()

    class Meta:
        model = Chat
        fields = ['id', 'name', 'is_group', 'created_at', 'members','is_active']

    def get_name(self, obj):
        
        if obj.is_group:
            return obj.name
        request_user = self.context['request'].user
        chat_user = ChatUser.objects.get(user=request_user)
        other_member = obj.members.exclude(id=chat_user.id).first()
        return other_member.user.first_name if other_member else "Unknown"
