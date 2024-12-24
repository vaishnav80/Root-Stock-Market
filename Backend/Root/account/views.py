from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UserUpdateSerializer

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        print('register')
        serializer = RegisterSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            try:
                print('dsfsd')
                user = serializer.save()
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Registration successful",
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    "message": "An error occurred during registration",
                    "error": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        errors = serializer.errors
        if "email" in errors:
            return Response({
                "message": "Invalid data provided",
                "field": "email",
                "error": errors["email"][0]  # First error for 'email'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if "password" in errors:
            return Response({
                "message": "Invalid data provided",
                "field": "password",
                "error": errors["password"][0]  # First error for 'password'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            "message": "Invalid data provided",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        print(serializer)
        try:
            if serializer.is_valid():
                user = serializer.validated_data['user']
                refresh = RefreshToken.for_user(user)
                return Response({
                    "message": "Login successful",
                    "user": UserSerializer(user).data,
                    "tokens": {
                        "refresh": str(refresh),
                        "access": str(refresh.access_token),
                    }
                })
            return Response({
                "message": "Invalid credentials",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "An error occurred during login",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()
                logout(request)
                return Response({
                    "message": "Successfully logged out"
                }, status=status.HTTP_200_OK)
            return Response({
                "message": "Refresh token is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "An error occurred during logout",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            serializer = UserSerializer(request.user)
            return Response({
                "user": serializer.data
            })
        except Exception as e:
            return Response({
                "message": "Error retrieving user details",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            serializer = UserUpdateSerializer(request.user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    "message": "Profile updated successfully",
                    "user": serializer.data
                })
            return Response({
                "message": "Invalid data provided",
                "errors": serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                "message": "Error updating user details",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            user = request.user
            user.is_active = False
            user.save()
            return Response({
                "message": "Account deactivated successfully"
            })
        except Exception as e:
            return Response({
                "message": "Error deactivating account",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)