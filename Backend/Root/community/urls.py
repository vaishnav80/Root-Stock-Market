from django.urls import path
from .views import *
urlpatterns = [
    path('chat_user/',Chat_user.as_view(),name='chat_user'),
    path('chat_data/',Chat_data.as_view(),name='chat')
]