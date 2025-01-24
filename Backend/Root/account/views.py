from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import logout
from rest_framework_simplejwt.exceptions import TokenError
from .models import CustomUser
from .serializers import UserSerializer, RegisterSerializer, LoginSerializer, UserUpdateSerializer ,PasswordResetSerializer
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_decode
from django.middleware.csrf import get_token
from django.http import JsonResponse


class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        
        serializer = RegisterSerializer(data=request.data)
      
        if serializer.is_valid():
            try:
                
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
     
        try:
            
            if not serializer.is_valid():
                return Response({
                    "status": "error",
                    "message": serializer.errors,
                }, status=401)
        

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
                "message": "Authentication failed"
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
    

class Forgot_password(APIView):

    permission_classes = [AllowAny]

    def post(self,request):
        email  = request.data.get('email')
        try:
            user = CustomUser.objects.get(email = email)
            token_generator = PasswordResetTokenGenerator()
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = token_generator.make_token(user)
            frontend_url = "http://localhost:5173/resetPassword"
            reset_link = f"{frontend_url}?uid={uid}&token={token}"
            subject = "Password Reset Request"
            message = f"Hi {user.first_name},\n\nClick the link below to reset your password:\n{reset_link}\n\nIf you did not request a password reset, ignore this email."
            print(message)
            send_mail(subject, message, "project2root@gmail.com", [email])
            print('d')
            return Response({"message" :"user found "}, status=status.HTTP_200_OK)
        except:
            return Response({"message" :"user not found please login first"}, status=status.HTTP_404_NOT_FOUND)


class PasswordResetView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data.get("uid")
            token = serializer.validated_data.get("token")
            new_password = serializer.validated_data.get("password")
            try:

                user_id = urlsafe_base64_decode(uid).decode()
                user = CustomUser.objects.get(pk=user_id)
                
           
                token_generator = PasswordResetTokenGenerator()
                if not token_generator.check_token(user, token):
                    return Response({"error": "Invalid or expired token"}, status=status.HTTP_400_BAD_REQUEST)

                user.set_password(new_password)
                user.save()
                return Response({"message": "Password reset successful"}, status=status.HTTP_200_OK)
            
            except (user.DoesNotExist, ValueError):
                return Response({"error": "Invalid UID"}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


from google.oauth2 import id_token   # type: ignore
from google.auth.transport import requests   # type: ignore
import jwt

class GoogleLoginAPIView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        token = request.data.get("token")
        decoded = jwt.decode(token, options={"verify_signature": False})
        try:
            email = decoded['email']
            name = decoded['name']
            user,create = CustomUser.objects.get_or_create(email=email,defaults={'first_name' :name,'is_active': True })
            refresh = RefreshToken.for_user(user)
            serializer = UserSerializer(user)
            return Response({
                "status": "success",
                "message": "Google login successful",
                "user": {"id": user.id, "email": user.email,"first_name":user.first_name,"is_staff":user.is_staff,"is_active":user.is_active},
                "tokens": {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                }
            }, status=status.HTTP_200_OK)
            
            
        except ValueError:
            return Response({"error": "Invalid token"}, status=400)


class CheckStatus(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({"is_active": request.user.is_active})


