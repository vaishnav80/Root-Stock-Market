from django.urls import path
from .views import *

urlpatterns = [
    path('chat/',Sessions.as_view(),name='chat')
]