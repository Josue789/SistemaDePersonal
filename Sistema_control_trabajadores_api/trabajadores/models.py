from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class User(AbstractUser):
    rfc = models.CharField(max_length=20, unique=True)
    rol = models.CharField(max_length=50, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'rfc'
    REQUIRED_FIELDS = ['username', 'email']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return self.rfc

class TipoAusencia(models.Model):
    nombre = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = 'Tipo de Ausencia'
        verbose_name_plural = 'Tipos de Ausencia'

    def __str__(self):
        return self.nombre

class Area(models.Model):
    nombre = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Área'
        verbose_name_plural = 'Áreas'

    def __str__(self):
        return self.nombre

class Puesto(models.Model):
    nombre = models.CharField(max_length=100, blank=True, null=True)
    area = models.ForeignKey(Area, on_delete=models.CASCADE, related_name='puestos')
    sueldo = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    class Meta:
        verbose_name = 'Puesto'
        verbose_name_plural = 'Puestos'

    def __str__(self):
        return self.nombre or "Sin nombre"

class Worker(models.Model):
    nombre = models.CharField(max_length=100)
    apellido_paterno = models.CharField(max_length=100)
    apellido_materno = models.CharField(max_length=100)
    fecha_nac = models.DateField(blank=True, null=True)
    curp = models.CharField(max_length=20, blank=True, null=True)
    rfc = models.CharField(max_length=20, blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    correo = models.EmailField(max_length=100, blank=True, null=True)

    calle = models.CharField(max_length=100, blank=True, null=True)
    numero = models.CharField(max_length=20, blank=True, null=True)
    estado = models.CharField(max_length=100, blank=True, null=True)
    municipio = models.CharField(max_length=100, blank=True, null=True)
    colonia = models.CharField(max_length=100, blank=True, null=True)
    cp = models.CharField(max_length=10, blank=True, null=True)
    pais = models.CharField(max_length=50, blank=True, null=True)

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='worker_profile')
    puesto = models.ForeignKey(Puesto, on_delete=models.SET_NULL, blank=True, null=True, related_name='workers')

    fecha_ingreso = models.DateField(blank=True, null=True)
    tipo_contrato = models.CharField(max_length=50, blank=True, null=True)
    fecha_termino_contrato = models.DateField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Trabajador'
        verbose_name_plural = 'Trabajadores'

    def __str__(self):
        return f"{self.nombre} {self.apellido_paterno} {self.apellido_materno}"

class Politica(models.Model):
    tipo = models.ForeignKey(TipoAusencia, on_delete=models.CASCADE, related_name='politicas')
    dias = models.IntegerField()
    periodo_dias = models.IntegerField()  # 365 = anual, 120 = cada 4 meses
    antiguedad_min = models.IntegerField(default=0)
    antiguedad_max = models.IntegerField(blank=True, null=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Política'
        verbose_name_plural = 'Políticas'

    def __str__(self):
        return f"{self.tipo.nombre} - {self.dias} días"

class WorkerPolitica(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='politicas_asignadas')
    politica = models.ForeignKey(Politica, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField(blank=True, null=True)
    asignacion_tipo = models.CharField(max_length=20, default='automatica')

    class Meta:
        verbose_name = 'Política de Trabajador'
        verbose_name_plural = 'Políticas de Trabajadores'
        indexes = [
            models.Index(fields=['worker'], name='idx_worker_politicas_worker'),
        ]

class Ausencia(models.Model):
    worker = models.ForeignKey(Worker, on_delete=models.CASCADE, related_name='ausencias')
    tipo = models.ForeignKey(TipoAusencia, on_delete=models.CASCADE)
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    dias = models.IntegerField()
    estatus = models.CharField(max_length=20, default='pendiente')
    aprobado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, blank=True, null=True, related_name='ausencias_aprobadas')
    fecha_aprobacion = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Ausencia'
        verbose_name_plural = 'Ausencias'
        indexes = [
            models.Index(fields=['worker'], name='idx_ausencias_worker'),
            models.Index(fields=['tipo'], name='idx_ausencias_tipo'),
            models.Index(fields=['fecha_inicio', 'fecha_fin'], name='idx_ausencias_fechas'),
        ]

    def __str__(self):
        return f"{self.worker.nombre} - {self.tipo.nombre} ({self.fecha_inicio})"

class DiaFestivo(models.Model):
    fecha = models.DateField(unique=True)
    descripcion = models.CharField(max_length=100, blank=True, null=True)
    obligatorio = models.BooleanField(default=True)
    activo = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Día Festivo'
        verbose_name_plural = 'Días Festivos'

    def __str__(self):
        return f"{self.fecha} - {self.descripcion}"

class Aviso(models.Model):
    titulo = models.CharField(max_length=100)
    fecha = models.DateField()
    descripcion = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Aviso'
        verbose_name_plural = 'Avisos'

    def __str__(self):
        return self.titulo

class VacationConfig(models.Model):
    meses_minimos = models.IntegerField(default=6)
    dias_iniciales = models.IntegerField(default=10)
    meses_vigencia = models.IntegerField(default=4)

    class Meta:
        verbose_name = 'Configuración de Vacaciones'
        verbose_name_plural = 'Configuraciones de Vacaciones'

    def __str__(self):
        return "Configuración Global de Vacaciones"
