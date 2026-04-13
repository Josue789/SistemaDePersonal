from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, TipoAusenciaViewSet, AreaViewSet, PuestoViewSet,
    WorkerViewSet, PoliticaViewSet, WorkerPoliticaViewSet,
    AusenciaViewSet, DiaFestivoViewSet, AvisoViewSet, VacationConfigViewSet
)
from .auth_views import CustomLoginView

router = DefaultRouter()
router.register(r'usuarios', UserViewSet)
router.register(r'tipos-ausencia', TipoAusenciaViewSet)
router.register(r'areas', AreaViewSet)
router.register(r'puestos', PuestoViewSet)
router.register(r'trabajadores', WorkerViewSet)
router.register(r'politicas', PoliticaViewSet)
router.register(r'trabajador-politicas', WorkerPoliticaViewSet)
router.register(r'ausencias', AusenciaViewSet)
router.register(r'dias-festivos', DiaFestivoViewSet)
router.register(r'avisos', AvisoViewSet)
router.register(r'config-vacaciones', VacationConfigViewSet)

urlpatterns = [
    path('auth/login/', CustomLoginView.as_view(), name='login'),
    path('', include(router.urls)),
]
