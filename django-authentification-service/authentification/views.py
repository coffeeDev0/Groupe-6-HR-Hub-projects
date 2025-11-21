from rest_framework import generics, permissions
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework.response import Response
from rest_framework.views import APIView


# Registration view
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer


class ProtectedView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data})
