# test_views.py
import pytest # type: ignore
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.contrib.auth import get_user_model

@pytest.mark.django_db
class TestRegisterView:
    def setup_method(self):
        self.client = APIClient()
        self.register_url = reverse('register')  

    def test_successful_registration(self):
        data = {
        'email': 'test@example.com',
        'password': 'strongpassword123',
        'confirm_password': 'strongpassword123',
        'username': 'testuser',
        'first_name': 'Test',
        'last_name': 'User'
    }
        response = self.client.post(self.register_url, data)
        print(response.data)
        assert response.status_code == status.HTTP_201_CREATED
        assert 'tokens' in response.data
        assert 'user' in response.data
        assert 'message' in response.data
        assert response.data['message'] == 'Registration successful'

    def test_invalid_email(self):
        data = {
            'email': 'invalid-email',
            'password': 'strongpassword123',
            'username': 'testuser'
        }
        response = self.client.post(self.register_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['field'] == 'email'

    def test_weak_password(self):
        data = {
            'email': 'test@example.com',
            'password': 'weak',
            'username': 'testuser'
        }
        response = self.client.post(self.register_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.data['field'] == 'password'

    def test_duplicate_email(self):

        data = {
            'email': 'existing@example.com',
            'password': 'strongpassword123',
            'username': 'testuser1'
        }
        self.client.post(self.register_url, data)

        response = self.client.post(self.register_url, data)
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST



@pytest.fixture
def api_client():
    from rest_framework.test import APIClient
    return APIClient()

@pytest.fixture
def create_test_user(db):
    User = get_user_model()
    user = User.objects.create_user(
        email='testuser@example.com',
        password='validpassword123',
        is_active=True
    )
    return user

@pytest.mark.django_db
class TestLoginView:
    def test_successful_login(self, api_client, create_test_user):
        login_url = reverse('login')
        data = {
            'email': 'testuser@example.com',
            'password': 'validpassword123'
        }
        
        response = api_client.post(login_url, data)
        
        assert response.status_code == status.HTTP_200_OK
        assert 'tokens' in response.data
        assert 'access' in response.data['tokens']
        assert 'refresh' in response.data['tokens']

    

    def test_login_short_password(self, api_client):
        login_url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': '1234'
        }
        
        response = api_client.post(login_url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'Password must be at least 8 characters' in str(response.data)

    def test_login_nonexistent_user(self, api_client):
        login_url = reverse('login')
        data = {
            'email': 'nonexistent@example.com',
            'password': 'somepassword'
        }
        
        response = api_client.post(login_url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'User not found' in str(response.data)

    def test_login_incorrect_password(self, api_client, create_test_user):
        login_url = reverse('login')
        data = {
            'email': 'testuser@example.com',
            'password': 'wrongpassword'
        }
        
        response = api_client.post(login_url, data)
        
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert 'Invalid credentials' in str(response.data)