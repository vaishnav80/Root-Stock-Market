from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'first_name', 'last_name', 'phone', 'about', 
                 'address', 'district', 'state', 'is_active', 'image' ,'is_staff')
        read_only_fields = ('id', 'is_active')

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )

    class Meta:
        model = CustomUser
        fields = ('email', 'password', 'confirm_password', 'first_name', 
                 'last_name', 'phone')
        extra_kwargs = {
            'first_name': {'required': True},
            'email': {'required': True}
        }

    def validate_email(self, value):
        print('self')
        if CustomUser.objects.filter(email=value.lower()).exists():
            
            raise serializers.ValidationError("Email already registered.")
        return value.lower()

    def validate(self, data):
        print('sdfsdf')
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords don't match"})
        return data

    def create(self, validated_data):
     
        validated_data.pop('confirm_password', None)
        return CustomUser.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        required=True,
        style={'input_type': 'password'},
        write_only=True
    )

    def validate(self, data):
        email = data.get("email", "").lower()
        password = data.get("password", "")
       
       
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters")
        
 
        try:    
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError( "User not found")
  
        try:
            user = authenticate(email=email, password=password)
        except:   
            raise serializers.ValidationError("Invalid credentials")
            

        if not user.is_active:
            raise serializers.ValidationError( "Account is disabled")
        
     
        data['user'] = user
        return data
    
class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('first_name', 'last_name', 'phone', 'about', 
                 'address', 'district', 'state', 'image','is_active')
        
    def validate_phone(self, value):
        """Validate phone number format"""
        if value and not value.isdigit():
            raise serializers.ValidationError("Phone number must contain only digits")
        return value
    
class PasswordResetSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(write_only=True, min_length=8)