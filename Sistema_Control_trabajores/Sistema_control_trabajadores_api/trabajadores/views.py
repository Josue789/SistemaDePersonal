from rest_framework import viewsets, permissions
from .models import User, TipoAusencia, Area, Puesto, Worker, Politica, WorkerPolitica, Ausencia, DiaFestivo, Aviso, VacationConfig
from .serializers import (
    UserSerializer, TipoAusenciaSerializer, AreaSerializer, PuestoSerializer,
    WorkerSerializer, PoliticaSerializer, WorkerPoliticaSerializer,
    AusenciaSerializer, DiaFestivoSerializer, AvisoSerializer,
    VacationConfigSerializer
)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

class TipoAusenciaViewSet(viewsets.ModelViewSet):
    queryset = TipoAusencia.objects.all()
    serializer_class = TipoAusenciaSerializer
    permission_classes = [permissions.AllowAny]

class AreaViewSet(viewsets.ModelViewSet):
    queryset = Area.objects.all()
    serializer_class = AreaSerializer
    permission_classes = [permissions.AllowAny]

class PuestoViewSet(viewsets.ModelViewSet):
    queryset = Puesto.objects.all()
    serializer_class = PuestoSerializer
    permission_classes = [permissions.AllowAny]

class WorkerViewSet(viewsets.ModelViewSet):
    queryset = Worker.objects.all()
    serializer_class = WorkerSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['activo']

    def get_queryset(self):
        user = self.request.user
        queryset = Worker.objects.all()

        if user.is_authenticated:
            if user.rol == 'Jefe de area':
                worker_profile = user.worker_profile.first()
                if worker_profile and worker_profile.puesto:
                    queryset = queryset.filter(puesto__area=worker_profile.puesto.area)
            elif user.rol == 'Trabajador':
                queryset = queryset.filter(user=user)
        
        # Keep extra filtering by user_id if provided via query params (for admin view)
        user_id = self.request.query_params.get('user', None)
        if user_id:
            queryset = queryset.filter(user_id=user_id)
            
        return queryset

    def perform_destroy(self, instance):
        if self.request.user.rol == 'Jefe de area':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Los Jefes de área no pueden eliminar trabajadores.")
        super().perform_destroy(instance)

class PoliticaViewSet(viewsets.ModelViewSet):
    queryset = Politica.objects.all()
    serializer_class = PoliticaSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['activo']

class WorkerPoliticaViewSet(viewsets.ModelViewSet):
    queryset = WorkerPolitica.objects.all()
    serializer_class = WorkerPoliticaSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['worker']

class AusenciaViewSet(viewsets.ModelViewSet):
    queryset = Ausencia.objects.all()
    serializer_class = AusenciaSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ['estatus', 'worker']

    def get_queryset(self):
        user = self.request.user
        queryset = Ausencia.objects.all()

        if user.is_authenticated:
            if user.rol == 'Jefe de area':
                worker_profile = user.worker_profile.first()
                if worker_profile and worker_profile.puesto:
                    queryset = queryset.filter(worker__puesto__area=worker_profile.puesto.area)
            elif user.rol == 'Trabajador':
                queryset = queryset.filter(worker__user=user)
        
        return queryset

    def perform_destroy(self, instance):
        if self.request.user.rol == 'Jefe de area':
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied("Los Jefes de área no pueden eliminar solicitudes.")
        super().perform_destroy(instance)

class DiaFestivoViewSet(viewsets.ModelViewSet):
    queryset = DiaFestivo.objects.all()
    serializer_class = DiaFestivoSerializer

class AvisoViewSet(viewsets.ModelViewSet):
    queryset = Aviso.objects.all()
    serializer_class = AvisoSerializer
    permission_classes = [permissions.AllowAny]

class VacationConfigViewSet(viewsets.ModelViewSet):
    queryset = VacationConfig.objects.all()
    serializer_class = VacationConfigSerializer
    permission_classes = [permissions.AllowAny]
