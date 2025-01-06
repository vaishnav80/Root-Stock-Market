from django.urls import path
from .views import *

urlpatterns = [
    path('wallet_data/',WalletData.as_view(),name='wallet'),
    path('transaction/',TransactionData.as_view(),name='transaction')
]