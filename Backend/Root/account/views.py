from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from rest_framework_simplejwt.exceptions import TokenError
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
                "error": errors["email"][0]  
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if "password" in errors:
            return Response({
                "message": "Invalid data provided",
                "field": "password",
                "error": errors["password"][0]  
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
            if not serializer.is_valid():
                print(serializer.errors,'ertertert')
                error_msg = serializer.errors
                print(error_msg,'error')
                if 'email' in error_msg:
                    return Response({
                        "status": "error",
                        "message": "Please enter a valid email address",
                        "field": "email"
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
                if 'password' in serializer.errors:
                    return Response({
                        "status": "error",
                        "message": "Password is required",
                        "field": "password"
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                if 'length' in serializer.errors:
                    return Response({
                        "status": "error",
                        "message": "Password must be contain 8 letters",
                        "field": "password"
                    }, status=status.HTTP_400_BAD_REQUEST)
                    
                    
                if "invalid" in error_msg:
                    return Response({
                        "status": "error",
                        "message": "Email or password is incorrect",
                        "field": "credentials"
                    }, status=status.HTTP_401_UNAUTHORIZED)
                    
                if "disabled" in error_msg:
                    return Response({
                        "status": "error",
                        "message": "Your account has been disabled. Please contact support.",
                        "field": "account"
                    }, status=status.HTTP_403_FORBIDDEN)
                
                return Response({
                    "status": "error",
                    "message": "Invalid input data",
                    "errors": serializer.errors
                }, status=status.HTTP_400_BAD_REQUEST)
        

            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            
            return Response({
                "status": "success",
                "message": "Login successful",
                "user": UserSerializer(user).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                "status": "error",
                "message": "An unexpected error occurred. Please try again.",
                "detail": str(e) 
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            print(f"Received refresh token: {refresh_token}")
            
            if refresh_token:
                try:
                    token = RefreshToken(refresh_token)
                    print(f"Token is valid: {token}")
                    token.blacklist()
                    logout(request)
                    return Response({
                        "message": "Successfully logged out"
                    }, status=status.HTTP_200_OK)
                except Exception as e:
                    print(f"Error during token processing: {e}")
                    return Response({
                        "message": "Invalid or expired refresh token"
                    }, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                "message": "Refresh token is required"
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(f"Unexpected error: {e}")
            return Response({
                "message": "An error occurred during logout",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            print(request.user,'userrrrr')
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
            print(serializer)
            if serializer.is_valid():
                print('ss')
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


class Userlist(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        print('asdsd')
        try:
            users = CustomUser.objects.exclude(is_staff =True).order_by('id')
            
            serializer = UserSerializer(users, many=True)
            return Response({
                    "user": serializer.data
                })
        except Exception as e:
            return Response({
                "message": "Error retrieving user details",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class Updateuser(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, id):
        try:
            
            user = CustomUser.objects.get(id=id)
        except CustomUser.DoesNotExist:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user.is_active = not user.is_active
        user.save()

        return Response({"message": f"User {user.email} status set to {user.is_active}.","active":user.is_active }, status=status.HTTP_200_OK)