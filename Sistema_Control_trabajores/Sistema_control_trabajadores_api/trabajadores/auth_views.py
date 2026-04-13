from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer

class CustomLoginView(APIView):
    permission_classes = []

    def post(self, request):
        usuario = request.data.get('usuario')
        password = request.data.get('password')

        if not usuario or not password:
            return Response(
                {'error': 'Por favor proporcione usuario y contraseña'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # authenticate uses the USERNAME_FIELD, which is 'rfc' in our model
        user = authenticate(username=usuario, password=password)

        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            return Response(
                {'error': 'Credenciales inválidas'},
                status=status.HTTP_401_UNAUTHORIZED
            )
