from rest_framework import viewsets
from main.models import Item
from .serializers import ItemSerializer
from api.permissions import IsAuthenticatedUser

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticatedUser]