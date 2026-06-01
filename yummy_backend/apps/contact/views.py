"""
Contact Views — Yummy-Yummy
POST /api/contact/                — Submit message (public)
GET  /api/contact/admin/messages/ — List all messages (admin)
DELETE /api/contact/admin/messages/{id}/ — Delete message (admin)
"""
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactMessage
from .serializers import ContactMessageSerializer


class SubmitContactView(generics.CreateAPIView):
    """POST /api/contact/"""
    serializer_class   = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Your message has been sent. We will get back to you soon!'},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminMessageListView(generics.ListAPIView):
    """GET /api/contact/admin/messages/"""
    serializer_class   = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    queryset           = ContactMessage.objects.all()


class AdminMessageDeleteView(generics.DestroyAPIView):
    """DELETE /api/contact/admin/messages/{id}/"""
    serializer_class   = ContactMessageSerializer
    permission_classes = [IsAdminUser]
    queryset           = ContactMessage.objects.all()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response({'message': 'Message deleted.'}, status=status.HTTP_200_OK)
