import django.utils.timezone
from django.db import models


# Create your models here.
class Campamento(models.Model):
    nombre = models.CharField(null=False, blank=False, max_length=40)
    iglesia = models.CharField(null=False, blank=False, max_length=40)
    precio = models.DecimalField(null=False, blank=False, max_digits=9, decimal_places=2)
    descripcion = models.CharField(blank=True, max_length=200)
    fechaDesde = models.DateField(null=False, blank=False, default=django.utils.timezone.now)
    fechaHasta = models.DateField(null=False, blank=False, default=django.utils.timezone.now)

    def __str__(self):
        return self.nombre
