# backend/asgi.py (assuming 'backend' is your project name)
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack # type: ignore
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Root.settings')
django.setup()

from stock.routing import websocket_urlpatterns  # Import your websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})