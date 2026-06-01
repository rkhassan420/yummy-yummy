"""
Feedback Views — Yummy-Yummy
GET  /api/feedback/          — List all feedback (public)
POST /api/feedback/          — Submit feedback (auth required)
DELETE /api/feedback/admin/{id}/ — Delete feedback (admin)
"""
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAdminUser, AllowAny
from rest_framework.response import Response

from .models import UserFeedback
from .serializers import FeedbackSerializer


class FeedbackListCreateView(generics.ListCreateAPIView):
    """
    GET  — public
    POST — authenticated users only
    """
    serializer_class = FeedbackSerializer
    queryset         = UserFeedback.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticatedOrReadOnly()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Thank you for your feedback!', 'feedback': serializer.data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminFeedbackDeleteView(generics.DestroyAPIView):
    """DELETE /api/feedback/admin/{id}/"""
    serializer_class   = FeedbackSerializer
    permission_classes = [IsAdminUser]
    queryset           = UserFeedback.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Feedback deleted.'}, status=status.HTTP_200_OK)
