from django.urls import path
from .views import *
urlpatterns = [
    path('news_data/',News_data.as_view(),name='news')
]