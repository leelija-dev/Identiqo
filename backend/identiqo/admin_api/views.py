from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import AdminRegistrationSerializer
from .models import AdminUser


@api_view(['POST'])
def admin_register(request):
    """
    API endpoint for admin registration
    """
    serializer = AdminRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'message': 'Admin registered successfully',
            'data': {
                'email': serializer.data['email'],
                'full_name': serializer.data.get('full_name'),
                'phone': serializer.data.get('phone')
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
