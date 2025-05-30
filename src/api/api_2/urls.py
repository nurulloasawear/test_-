
from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'statistics', views.StatisticViewSet)

urlpatterns = [
    path('', include(router.urls)),
]