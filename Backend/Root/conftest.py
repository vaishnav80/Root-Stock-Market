# conftest.py
import pytest  # type: ignore

@pytest.fixture
def django_db_setup():
    from django.conf import settings
    settings.DATABASES['default'] = {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
        'ATOMIC_REQUESTS': False
    }
