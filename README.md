# Task Manager Application

**Developer:** Samuel (Sami)  
**Challenge Completion Date:** January 23, 2026

A full-stack task management application built with Django REST Framework and Next.js, containerized with Docker and orchestrated using Docker Compose.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
  - [Docker Deployment (Recommended)](#docker-deployment-recommended)
  - [Local Development](#local-development)
- [How to Access the Application](#how-to-access-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [My Approach](#my-approach)
- [Testing](#testing)
- [Bonus Features](#bonus-features)
- [Production Considerations](#production-considerations)

---

## Overview

This project is a Django-based task management web application that allows users to create, read, update, and delete tasks. Each user has their own isolated task list accessible through a modern, responsive web interface built with Next.js and DaisyUI.

### Challenge Requirements Met

✅ **Django CRUD Application** - Full task management system  
✅ **Custom User Authentication** - Users only see their own tasks  
✅ **Tailwind CSS Frontend** - Clean, responsive UI with DaisyUI  
✅ **PostgreSQL Database** - Production-ready data storage  
✅ **Docker Containerization** - Separate containers for Django, PostgreSQL, and Nginx  
✅ **Complete Documentation** - Detailed setup and usage instructions  
✅ **RESTful API** - Full API with Swagger-compatible endpoints  
✅ **Bonus: Next.js Frontend** - Modern React framework with DaisyUI components

---

## Tech Stack

### Backend
- **Django 6.0.1** - Python web framework
- **Django REST Framework** - RESTful API toolkit
- **djangorestframework-simplejwt** - JWT authentication
- **PostgreSQL** - Production database
- **Gunicorn** - WSGI HTTP server

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **DaisyUI** - Tailwind component library
- **Axios** - Promise-based HTTP client

### DevOps
- **Docker** - Containerization platform
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and web server
- **PostgreSQL 15** - Relational database

---

## Features

### Core Functionality
- ✅ **Task CRUD Operations** - Create, read, update, and delete tasks
- ✅ **Task Fields** - Title, Description, Status (Pending/In Progress/Completed), Due Date
- ✅ **User Authentication** - Email-based registration and login
- ✅ **User Isolation** - Each user can only access their own tasks
- ✅ **Responsive Design** - Mobile-friendly interface

### Technical Features
- ✅ **JWT Authentication** - Secure token-based authentication
- ✅ **Automatic Token Refresh** - Seamless session management
- ✅ **RESTful API** - Well-structured API endpoints
- ✅ **Docker Compose** - One-command deployment
- ✅ **Nginx Reverse Proxy** - Production-ready architecture
- ✅ **Type Safety** - TypeScript for frontend development

---

## Prerequisites

### For Docker Deployment (Recommended):
- Docker 20.10 or higher
- Docker Compose 2.0 or higher

### For Local Development:
- Python 3.12 or higher
- Node.js 22 or higher
- npm or yarn
- PostgreSQL (optional, can use SQLite)

---

## Setup Instructions

### Docker Deployment (Recommended)

This is the **easiest and recommended** way to run the application. All services are containerized and configured to work together.

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Simao-Django-Test-Project
```

#### 2. Build and Start the Application

**Option A: Using the convenience script (recommended)**
```bash
./run.sh start
```

**Option B: Using docker-compose directly**
```bash
docker-compose up --build
```

The script/command will:
- Build the Django backend container
- Build the Next.js frontend container
- Pull and configure PostgreSQL database
- Set up Nginx as a reverse proxy
- Run database migrations automatically
- Start all services

#### 3. Wait for Services to Start
The first build may take a few minutes. You'll see output from all services. Wait until you see:
```
taskmanager_backend   | Starting development server at http://0.0.0.0:8000/
taskmanager_frontend  | ✓ Ready in 166ms
```

#### 4. Access the Application
- **Frontend**: http://localhost
- **API Documentation**: http://localhost/api
- **Django Admin**: http://localhost/admin

#### 5. Create a Superuser (Optional)
```bash
./run.sh superuser
# OR
docker-compose exec backend python manage.py createsuperuser
```

Follow the prompts to create an admin user for the Django admin panel.

#### 6. Other Useful Commands

**View logs**:
```bash
./run.sh logs          # All services
./run.sh logs backend  # Specific service
```

**Check status**:
```bash
./run.sh status
```

**Stop the application**:
```bash
./run.sh stop
# OR
docker-compose down
```

**Restart the application**:
```bash
./run.sh restart
```

**Clean everything (removes data)**:
```bash
./run.sh clean
# OR
docker-compose down -v
```

**Access database shell**:
```bash
./run.sh dbshell
```

**See all available commands**:
```bash
./run.sh help
```

---

### Local Development

If you prefer to run services individually for development:

#### Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Create and activate virtual environment**:
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

4. **Run migrations**:
```bash
python3 manage.py migrate
```

5. **Create superuser**:
```bash
python3 manage.py createsuperuser
```

6. **Start Django server**:
```bash
python3 manage.py runserver
```

Backend runs at: http://localhost:8000

#### Frontend Setup

In a **new terminal**:

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

Frontend runs at: http://localhost:3000

---

## How to Access the Application

### With Docker (Port 80)
Once `docker-compose up` is running:

1. **Open your browser** and go to: http://localhost
2. **Register a new account** by clicking "Get Started" or "Register"
3. **Fill in the registration form**:
   - Email (used for login)
   - Username (display name)
   - Password
4. **You'll be automatically logged in** and redirected to the dashboard
5. **Create your first task** by clicking "Create Task"
6. **Manage your tasks**: Edit, delete, or filter by status

### With Local Development
1. Navigate to http://localhost:3000
2. Follow the same steps as above

### Docker Container URLs
**Note**: The URLs shown in Docker Desktop container logs (like `http://0.0.0.0:8000` or `http://container-id:3000`) are **internal** to Docker and won't work in your browser. Always use **http://localhost** when running with Docker Compose.

---

## API Documentation

### Base URL
- **Local Development**: `http://localhost:8000/api`
- **Docker Deployment**: `http://localhost/api`

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register/` | Register new user | No |
| POST | `/api/auth/login/` | Login with email/password | No |
| POST | `/api/auth/logout/` | Logout (blacklist token) | Yes |
| POST | `/api/auth/token/refresh/` | Refresh access token | Yes |
| GET | `/api/auth/user/` | Get current user info | Yes |

### Task Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/tasks/` | List all user's tasks | Yes |
| POST | `/api/tasks/` | Create new task | Yes |
| GET | `/api/tasks/{id}/` | Get task details | Yes |
| PUT | `/api/tasks/{id}/` | Update task (full) | Yes |
| PATCH | `/api/tasks/{id}/` | Update task (partial) | Yes |
| DELETE | `/api/tasks/{id}/` | Delete task | Yes |

### Sample API Usage

#### Register a User
```bash
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

#### Login
```bash
curl -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

Response:
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

#### Create a Task
```bash
curl -X POST http://localhost/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "title": "Complete project",
    "description": "Finish the Django challenge",
    "status": "in_progress",
    "due_date": "2026-01-25"
  }'
```

#### List Tasks
```bash
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Project Structure

```
Simao-Django-Test-Project/
│
├── backend/                        # Django Backend
│   ├── taskmanager/               # Project configuration
│   │   ├── settings.py            # Django settings (DB, JWT, CORS)
│   │   ├── urls.py                # Main URL routing
│   │   └── wsgi.py                # WSGI config for Gunicorn
│   ├── tasks/                     # Tasks application
│   │   ├── models.py              # Task model definition
│   │   ├── serializers.py         # DRF serializers
│   │   ├── views.py               # API views and ViewSets
│   │   ├── urls.py                # Task app URL routing
│   │   └── admin.py               # Django admin configuration
│   ├── manage.py                  # Django CLI tool
│   ├── requirements.txt           # Python dependencies
│   ├── Dockerfile                 # Backend Docker configuration
│   └── .dockerignore              # Docker ignore patterns
│
├── frontend/                       # Next.js Frontend
│   ├── app/                       # Next.js App Router
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout with DaisyUI theme
│   │   ├── globals.css            # Global styles (Tailwind + DaisyUI)
│   │   ├── login/page.tsx         # Login page
│   │   ├── register/page.tsx      # Registration page
│   │   └── dashboard/page.tsx     # Task dashboard (protected)
│   ├── components/                # React components
│   │   └── Navbar.tsx             # Navigation bar with auth state
│   ├── lib/                       # Utility functions
│   │   ├── api.ts                 # Axios instance with interceptors
│   │   ├── auth.ts                # Auth helpers (token management)
│   │   └── types.ts               # TypeScript type definitions
│   ├── package.json               # Node.js dependencies
│   ├── next.config.ts             # Next.js configuration
│   ├── postcss.config.mjs         # PostCSS configuration
│   ├── Dockerfile                 # Frontend Docker configuration
│   └── .dockerignore              # Docker ignore patterns
│
├── nginx/                          # Nginx Reverse Proxy
│   └── nginx.conf                 # Nginx routing configuration
│
├── docker-compose.yml              # Docker Compose orchestration
├── run.sh                          # Docker management script (start/stop/logs)
├── .dockerignore                   # Project-level Docker ignore
└── README.md                       # This file
```

---

## My Approach

### 1. **Requirement Analysis**
I carefully reviewed the challenge requirements and identified the core components:
- Django backend with CRUD functionality
- Custom user authentication
- PostgreSQL database
- Docker containerization with separate services
- Frontend with Tailwind CSS

### 2. **Architecture Decision**
I chose to implement a **decoupled architecture** with:
- **Django REST Framework** for the backend API (instead of traditional Django templates)
- **Next.js** for the frontend (as requested by you)
- **JWT tokens** for stateless authentication
- **Nginx** as a reverse proxy to route requests appropriately

This approach provides:
- Better separation of concerns
- Easier scalability
- Modern development experience
- API-first design

### 3. **Implementation Strategy**

#### Phase 1: Backend Development
- Set up Django project and tasks app
- Created Task model with required fields (title, description, status, due_date)
- Implemented DRF ViewSets for automatic CRUD endpoints
- Added JWT authentication with djangorestframework-simplejwt
- Configured user isolation (users only see their own tasks)
- Set up CORS for frontend communication

#### Phase 2: Frontend Development
- Initialized Next.js 16 with TypeScript
- Integrated Tailwind CSS v4 and DaisyUI
- Created authentication pages (login, register)
- Built task dashboard with CRUD operations
- Implemented JWT token management with automatic refresh
- Added responsive design for mobile devices
- Created reusable components (Navbar, forms, etc.)

#### Phase 3: Dockerization
- Created Dockerfile for Django backend with Gunicorn
- Created Dockerfile for Next.js frontend with production build
- Configured PostgreSQL service in docker-compose.yml
- Set up Nginx as reverse proxy
- Ensured proper networking between containers
- Added health checks and automatic migrations

### 4. **Key Technical Decisions**

**Email-based Authentication**: I chose email over username for login as it's more user-friendly and commonly expected in modern applications.

**JWT Tokens**: Implemented stateless authentication with:
- Access tokens (60 minutes lifespan)
- Refresh tokens (1 day lifespan)
- Automatic token refresh on API calls

**DaisyUI Components**: Used pre-built components for faster development while maintaining a professional look.

**Docker Networking**: Configured services to communicate internally while exposing only Nginx (port 80) externally for security.

**TypeScript**: Added type safety to the frontend to catch errors early and improve code quality.

### 5. **Challenges and Solutions**

**Challenge 1**: Managing authentication state in Next.js  
**Solution**: Implemented a custom event system (`authChange` event) to synchronize auth state across components in real-time.

**Challenge 2**: Token refresh causing login errors to disappear  
**Solution**: Modified Axios interceptor to skip token refresh for authentication endpoints, preserving error messages.

**Challenge 3**: Docker container communication  
**Solution**: Used Docker Compose networking with proper service names and internal ports, exposing only Nginx externally.

---

## Testing

### Manual Testing via Web Interface

1. **User Registration and Authentication**:
   - ✅ Register new user with email/username/password
   - ✅ Login with email and password
   - ✅ Username displays in navbar after login
   - ✅ Token refresh works automatically
   - ✅ Logout clears authentication

2. **Task Management**:
   - ✅ Create task with all fields
   - ✅ View list of tasks
   - ✅ Edit existing task
   - ✅ Delete task
   - ✅ Filter by status (Pending/In Progress/Completed)
   - ✅ Tasks are sorted by creation date (newest first)

3. **User Isolation**:
   - ✅ User A cannot see User B's tasks
   - ✅ API enforces user-specific queries
   - ✅ Unauthorized access returns 401

4. **Responsive Design**:
   - ✅ Works on desktop (1920x1080)
   - ✅ Works on tablet (768px)
   - ✅ Works on mobile (375px)

### API Testing with cURL

You can test the API manually using cURL commands. Here's a quick test flow:

```bash
# 1. Register a user
curl -X POST http://localhost/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "testpass123"}'

# 2. Login to get token
TOKEN=$(curl -s -X POST http://localhost/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])")

# 3. Create a task
curl -X POST http://localhost/api/tasks/ \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"title": "Test Task", "description": "Testing API", "status": "pending", "due_date": "2026-01-30"}'

# 4. List all tasks
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer $TOKEN"
```

### Database Verification

**Check data in PostgreSQL** (with Docker):
```bash
docker-compose exec db psql -U postgres -d taskmanager
# OR use the convenience script:
./run.sh dbshell

# List all tables
\dt

# View users
SELECT id, username, email FROM auth_user;

# View tasks
SELECT id, title, status, user_id FROM tasks_task;

# Exit
\q
```

### Django Admin Panel

Access the admin panel at http://localhost/admin to:
- View all users
- Inspect tasks
- Verify relationships
- Check data integrity

---

## Bonus Features

### Required Features ✅
- ✅ Django CRUD application for tasks
- ✅ Custom user login system with isolation
- ✅ Tailwind CSS frontend (with DaisyUI)
- ✅ PostgreSQL database
- ✅ Docker and Docker Compose containerization
- ✅ Separate containers for Django, PostgreSQL, and Nginx
- ✅ Comprehensive README with setup instructions

### Optional/Bonus Features ✅
- ✅ **RESTful API** with full CRUD operations
- ✅ **Next.js Frontend** (client-requested bonus)
- ✅ **DaisyUI Components** (client-requested bonus)
- ✅ **JWT Authentication** with automatic token refresh
- ✅ **Email-based login** (modern UX)
- ✅ **TypeScript** for type safety
- ✅ **Responsive design** (mobile-friendly)
- ✅ **Production-ready Dockerfiles** with multi-stage builds
- ✅ **Nginx reverse proxy** for proper routing
- ✅ **Comprehensive error handling** (frontend and backend)
- ✅ **API documentation** in README

---

## Production Considerations

### Security Enhancements Needed
- [ ] Change `SECRET_KEY` to environment variable
- [ ] Set `DEBUG = False` in production
- [ ] Configure `ALLOWED_HOSTS` properly
- [ ] Enable HTTPS with SSL certificates
- [ ] Implement rate limiting on API endpoints
- [ ] Add CSRF protection for cookie-based sessions
- [ ] Use secure password policies

### Performance Optimizations
- [ ] Enable Redis for caching
- [ ] Configure database connection pooling
- [ ] Set up CDN for static files
- [ ] Enable Gzip compression in Nginx
- [ ] Optimize Docker image sizes
- [ ] Add database indexes for common queries

### Monitoring and Logging
- [ ] Set up centralized logging (ELK stack or similar)
- [ ] Add error tracking (Sentry)
- [ ] Monitor API performance
- [ ] Track user analytics
- [ ] Set up health check endpoints

### Deployment
- [ ] Use environment variables for all secrets
- [ ] Set up CI/CD pipeline
- [ ] Configure automated backups for PostgreSQL
- [ ] Use Docker registry for image storage
- [ ] Set up staging environment

---

## Additional Notes

### Why This Architecture?

I chose a **modern, API-first architecture** because:
1. It's scalable and maintainable
2. Frontend and backend can be developed independently
3. The API can be consumed by mobile apps or other clients in the future
4. It follows industry best practices
5. It demonstrates full-stack capabilities

### Time Investment

This project was completed in approximately **2 days**:
- Day 1: Backend setup, models, API, authentication
- Day 2: Frontend development, Docker configuration, testing, documentation

### What I'm Proud Of

1. **Clean code structure** with clear separation of concerns
2. **Comprehensive error handling** for better UX
3. **Production-ready Docker setup** with multi-stage builds
4. **Type-safe frontend** with TypeScript
5. **Thorough documentation** for easy setup
6. **Modern UI/UX** with DaisyUI components

---

## Contact

**Developer**: Samuel Godad   
**Date**: January 23, 2026  
**Challenge**: Full-Stack Developer Technical Challenge

Thank you for reviewing my submission! I'm excited to discuss any aspects of this project. 🚀

---

## License

This project was created as part of a technical challenge. All rights reserved.
