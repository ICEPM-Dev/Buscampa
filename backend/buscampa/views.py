from rest_framework import viewsets

from .models import Campamento
from .serializer import CampamentoSerializer


# Create your views here.
class CampamentoView(viewsets.ModelViewSet):
    serializer_class = CampamentoSerializer
    queryset = Campamento.objects.all()
