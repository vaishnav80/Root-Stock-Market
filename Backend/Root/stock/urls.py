from django.urls import path
from .consumers import StockPriceConsumer,StockList

urlpatterns = [
    path('stock/',StockPriceConsumer,name='stock'),
    path('data/',StockList,name='data')
]