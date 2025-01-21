from django.urls import path

from .views import *
urlpatterns = [
    path('analysis/',Analysis.as_view(),name='analysis'),
    path('watchlist/',WatchLists.as_view(),name='watchlist')
]