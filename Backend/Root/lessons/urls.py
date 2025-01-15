from django.urls import path
from .views import *

urlpatterns = [
    path('create/', Lessons.as_view(), name='lesson-create'),
    path('delete/<int:id>',Delete_lesson.as_view(),name='delete-lesson'),
    path('content/<int:id>',Content.as_view(),name="content"),
    path('quiz/',Quiz_data.as_view(),name='quiz'),
    path('quiz_edit/<int:id>',Quiz_edit.as_view(),name='quiz'),
    path('quiz_attend/',Quiz_attend.as_view(),name='quiz_attend'),
    path('update-order/',OrderLesson.as_view(),name='order')
]