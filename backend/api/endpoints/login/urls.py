from rest_framework_simplejwt.views import TokenObtainPairView
from api.endpoints.login.views import RegisterAPIView
from django.urls import path

urlpatterns = [
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterAPIView.as_view(), name='register'),
]