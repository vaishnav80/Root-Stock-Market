from django.urls import path
from .views import *
urlpatterns = [
    path('order_data/',Orders.as_view(),name='order'),
    path('invest/',Investments.as_view(),name='invest')
]