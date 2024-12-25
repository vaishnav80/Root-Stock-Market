from django.urls import path
from .views import *

urlpatterns = [
    path('create/', Lessons.as_view(), name='lesson-create'),
]