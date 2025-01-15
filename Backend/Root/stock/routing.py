# stocks/routing.py
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/stock/$', consumers.StockPriceConsumer.as_asgi()),
    re_path(r'^ws/data/$', consumers.StockList.as_asgi()),
    re_path(r'^ws/Userdata/$', consumers.UserStockList.as_asgi()),
]