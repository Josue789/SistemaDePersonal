from rest_framework import serializers
from .models import User, TipoAusencia, Area, Puesto, Worker, Politica, WorkerPolitica, Ausencia, DiaFestivo, Aviso, VacationConfig

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'rfc', 'rol', 'username', 'email', 'first_name', 'last_name', 'password', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class TipoAusenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = TipoAusencia
        fields = '__all__'

class AreaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Area
        fields = '__all__'

class PuestoSerializer(serializers.ModelSerializer):
    area_detail = AreaSerializer(source='area', read_only=True)
    class Meta:
        model = Puesto
        fields = '__all__'

class WorkerSerializer(serializers.ModelSerializer):
    puesto_detail = PuestoSerializer(source='puesto', read_only=True)
    class Meta:
        model = Worker
        fields = '__all__'

class PoliticaSerializer(serializers.ModelSerializer):
    tipo_detail = TipoAusenciaSerializer(source='tipo', read_only=True)
    class Meta:
        model = Politica
        fields = '__all__'

class WorkerPoliticaSerializer(serializers.ModelSerializer):
    worker_detail = WorkerSerializer(source='worker', read_only=True)
    politica_detail = PoliticaSerializer(source='politica', read_only=True)
    class Meta:
        model = WorkerPolitica
        fields = '__all__'

class AusenciaSerializer(serializers.ModelSerializer):
    worker_detail = WorkerSerializer(source='worker', read_only=True)
    tipo_detail = TipoAusenciaSerializer(source='tipo', read_only=True)
    class Meta:
        model = Ausencia
        fields = '__all__'

class DiaFestivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = DiaFestivo
        fields = '__all__'

class AvisoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aviso
        fields = '__all__'

class VacationConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = VacationConfig
        fields = '__all__'
