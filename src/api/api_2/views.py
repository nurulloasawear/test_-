from rest_framework import viewsets
from main.models import Statistic
from .serializers import StatisticSerializer
from api.permissions import IsAuthenticatedUser

class StatisticViewSet(viewsets.ModelViewSet):
    queryset = Statistic.objects.all()
    serializer_class = StatisticSerializer
    permission_classes = [IsAuthenticatedUser]
