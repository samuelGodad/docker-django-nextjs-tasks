from django.test import TestCase
from django.contrib.auth.models import User
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import date, timedelta
from .models import Task


class TaskModelTest(TestCase):
    """Test cases for Task model"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_task_creation(self):
        """Test that a task can be created with valid data"""
        task = Task.objects.create(
            user=self.user,
            title='Test Task',
            description='Test Description',
            status='pending',
            due_date=date.today() + timedelta(days=7)
        )
        self.assertEqual(task.title, 'Test Task')
        self.assertEqual(task.user, self.user)
        self.assertEqual(task.status, 'pending')
        self.assertTrue(isinstance(task, Task))
    
    def test_task_string_representation(self):
        """Test the string representation of a task"""
        task = Task.objects.create(
            user=self.user,
            title='Test Task',
            description='Test Description',
            status='pending',
            due_date=date.today()
        )
        self.assertEqual(str(task), 'Test Task - testuser')
    
    def test_task_ordering(self):
        """Test that tasks are ordered by creation date (newest first)"""
        task1 = Task.objects.create(
            user=self.user,
            title='First Task',
            description='First',
            status='pending',
            due_date=date.today()
        )
        task2 = Task.objects.create(
            user=self.user,
            title='Second Task',
            description='Second',
            status='pending',
            due_date=date.today()
        )
        tasks = Task.objects.all()
        self.assertEqual(tasks[0], task2)  # Most recent first
        self.assertEqual(tasks[1], task1)


class TaskAPITest(APITestCase):
    """Test cases for Task API endpoints"""
    
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='apiuser',
            email='api@example.com',
            password='apipass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            password='otherpass123'
        )
    
    def get_auth_token(self, email='api@example.com', password='apipass123'):
        """Helper method to get JWT token"""
        response = self.client.post('/api/auth/login/', {
            'email': email,
            'password': password
        })
        return response.data['access']
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'newpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['email'], 'new@example.com')
    
    def test_user_login(self):
        """Test user login endpoint"""
        response = self.client.post('/api/auth/login/', {
            'email': 'api@example.com',
            'password': 'apipass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_create_task_authenticated(self):
        """Test creating a task with authentication"""
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.post('/api/tasks/', {
            'title': 'API Test Task',
            'description': 'Testing API task creation',
            'status': 'pending',
            'due_date': str(date.today() + timedelta(days=7))
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['title'], 'API Test Task')
        self.assertEqual(response.data['status'], 'pending')
    
    def test_create_task_unauthenticated(self):
        """Test that creating a task without authentication fails"""
        response = self.client.post('/api/tasks/', {
            'title': 'Unauthorized Task',
            'description': 'Should fail',
            'status': 'pending',
            'due_date': str(date.today())
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_list_tasks_authenticated(self):
        """Test listing tasks for authenticated user"""
        # Create a task for the user
        Task.objects.create(
            user=self.user,
            title='User Task',
            description='Test',
            status='pending',
            due_date=date.today()
        )
        
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response has pagination or is a simple list
        if isinstance(response.data, dict) and 'results' in response.data:
            tasks = response.data['results']
        else:
            tasks = response.data
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['title'], 'User Task')
    
    def test_user_isolation(self):
        """Test that users can only see their own tasks"""
        # Create tasks for different users
        Task.objects.create(
            user=self.user,
            title='User 1 Task',
            description='Test',
            status='pending',
            due_date=date.today()
        )
        Task.objects.create(
            user=self.other_user,
            title='User 2 Task',
            description='Test',
            status='pending',
            due_date=date.today()
        )
        
        # Login as first user
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.get('/api/tasks/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if response has pagination or is a simple list
        if isinstance(response.data, dict) and 'results' in response.data:
            tasks = response.data['results']
        else:
            tasks = response.data
        self.assertEqual(len(tasks), 1)
        self.assertEqual(tasks[0]['title'], 'User 1 Task')
        
        # Verify other user's task is not visible
        self.assertNotEqual(tasks[0]['title'], 'User 2 Task')
    
    def test_update_task(self):
        """Test updating a task"""
        task = Task.objects.create(
            user=self.user,
            title='Original Title',
            description='Original',
            status='pending',
            due_date=date.today()
        )
        
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.patch(f'/api/tasks/{task.id}/', {
            'status': 'completed'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        
        # Verify in database
        task.refresh_from_db()
        self.assertEqual(task.status, 'completed')
    
    def test_delete_task(self):
        """Test deleting a task"""
        task = Task.objects.create(
            user=self.user,
            title='Task to Delete',
            description='Test',
            status='pending',
            due_date=date.today()
        )
        
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete(f'/api/tasks/{task.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        
        # Verify task is deleted
        self.assertFalse(Task.objects.filter(id=task.id).exists())
    
    def test_cannot_delete_other_user_task(self):
        """Test that users cannot delete other users' tasks"""
        # Create task for other user
        other_task = Task.objects.create(
            user=self.other_user,
            title='Other User Task',
            description='Test',
            status='pending',
            due_date=date.today()
        )
        
        # Try to delete as first user
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.delete(f'/api/tasks/{other_task.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Verify task still exists
        self.assertTrue(Task.objects.filter(id=other_task.id).exists())
    
    def test_task_status_validation(self):
        """Test that invalid status values are rejected"""
        token = self.get_auth_token()
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        
        response = self.client.post('/api/tasks/', {
            'title': 'Invalid Status Task',
            'description': 'Test',
            'status': 'invalid_status',  # Invalid status
            'due_date': str(date.today())
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
