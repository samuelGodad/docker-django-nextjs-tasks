from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
from drf_spectacular.types import OpenApiTypes
from .models import Task
from .serializers import TaskSerializer, UserSerializer, LoginSerializer, LogoutSerializer


class TaskViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Task CRUD operations
    Users can only see and modify their own tasks
    """
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Return only tasks belonging to the current user
        return Task.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # Automatically set the user to the current user
        serializer.save(user=self.request.user)


@extend_schema(
    request=UserSerializer,
    responses={
        201: {
            'type': 'object',
            'properties': {
                'user': {'type': 'object'},
                'refresh': {'type': 'string'},
                'access': {'type': 'string'},
                'message': {'type': 'string'}
            }
        },
        400: {'description': 'Bad Request - Validation errors'}
    },
    examples=[
        OpenApiExample(
            'Register Example',
            value={
                'username': 'johndoe',
                'email': 'john@example.com',
                'password': 'securepass123'
            },
            request_only=True
        )
    ]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    request=LoginSerializer,
    responses={
        200: {
            'type': 'object',
            'properties': {
                'user': {'type': 'object'},
                'refresh': {'type': 'string'},
                'access': {'type': 'string'},
                'message': {'type': 'string'}
            }
        },
        400: {'description': 'Bad Request - Missing credentials'},
        401: {'description': 'Unauthorized - Invalid credentials'}
    },
    examples=[
        OpenApiExample(
            'Login Example',
            value={
                'email': 'john@example.com',
                'password': 'securepass123'
            },
            request_only=True
        )
    ]
)
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user with email and password, return JWT tokens
    """
    from django.contrib.auth import authenticate
    from django.contrib.auth.models import User
    
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response({
            'error': 'Email and password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Find user by email
    try:
        user_obj = User.objects.get(email=email)
        username = user_obj.username
    except User.DoesNotExist:
        return Response({
            'error': f'No account found with email "{email}"'
        }, status=status.HTTP_401_UNAUTHORIZED)
    
    # Authenticate with username (Django's default)
    user = authenticate(username=username, password=password)
    
    if user:
        refresh = RefreshToken.for_user(user)
        serializer = UserSerializer(user)
        return Response({
            'user': serializer.data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'message': 'Login successful'
        })
    else:
        return Response({
            'error': 'Invalid password'
        }, status=status.HTTP_401_UNAUTHORIZED)


@extend_schema(
    request=LogoutSerializer,
    responses={
        200: {
            'type': 'object',
            'properties': {
                'message': {'type': 'string'}
            }
        },
        400: {'description': 'Bad Request - Invalid token'}
    },
    examples=[
        OpenApiExample(
            'Logout Example',
            value={
                'refresh': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            request_only=True
        )
    ]
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout user by blacklisting the refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@extend_schema(
    responses={
        200: UserSerializer,
        401: {'description': 'Unauthorized'}
    }
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Get current logged-in user details
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)
