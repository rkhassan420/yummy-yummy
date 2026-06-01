from rest_framework import serializers
from .models import ContactMessage


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactMessage
        fields = ['id', 'name', 'email', 'cell_number', 'msg', 'created_at']
        read_only_fields = ['id', 'created_at']

    def validate_msg(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError('Message is too short.')
        return value.strip()
