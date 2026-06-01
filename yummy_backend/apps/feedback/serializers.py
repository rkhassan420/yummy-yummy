from rest_framework import serializers
from .models import UserFeedback


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model  = UserFeedback
        fields = ['id', 'name', 'review', 'rating', 'created_at']
        read_only_fields = ['id', 'created_at', 'name']

    def validate_review(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError('Review is too short.')
        return value.strip()

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['user'] = user
        validated_data['name'] = user.first_name or user.email.split('@')[0]
        return super().create(validated_data)
