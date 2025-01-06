from django.urls import path
from .views import *

urlpatterns = [
    path('create/', Lessons.as_view(), name='lesson-create'),
    path('delete/<int:id>',Delete_lesson.as_view(),name='delete-lesson'),
    path('content/<int:id>',Content.as_view(),name="content"),
]