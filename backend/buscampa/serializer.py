from rest_framework import serializers

from .models import Campamento


class CampamentoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campamento
        fields = '__all__'
