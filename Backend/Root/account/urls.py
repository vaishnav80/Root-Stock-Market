from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import RegisterView, LoginView,GoogleLoginAPIView, LogoutView, UserDetailView,Userlist,Updateuser,Forgot_password,PasswordResetView,CheckStatus
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('profile/', UserDetailView.as_view(), name='profile'),
    path('userlist/',Userlist.as_view(),name='userlist'),
    path('update/<int:id>/',Updateuser.as_view(),name='update'),
    path('forgot_password/',Forgot_password.as_view(),name='forgot'),
    path('reset-password/', PasswordResetView.as_view(), name='reset-password'),  
    path('google-login/',GoogleLoginAPIView.as_view(),name='google'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('check-status/',CheckStatus.as_view(),name="status")
]