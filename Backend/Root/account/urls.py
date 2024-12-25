from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import RegisterView, LoginView, LogoutView, UserDetailView,Userlist,Updateuser

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserDetailView.as_view(), name='profile'),
    path('userlist/',Userlist.as_view(),name='userlist'),
    path('update/<int:id>/',Updateuser.as_view(),name='update')
]