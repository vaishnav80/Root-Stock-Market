
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter # type: ignore
from channels.auth import AuthMiddlewareStack # type: ignore
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Root.settings')
django.setup()

from stock.routing import websocket_urlpatterns as stock_websocket_patterns
from contactus.routing import websocket_urlpatterns as contactus_websocket_patterns


combined_websocket_urlpatterns = stock_websocket_patterns + contactus_websocket_patterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            combined_websocket_urlpatterns
        )
    ),
})