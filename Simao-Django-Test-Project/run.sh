#!/bin/bash

# Task Manager Application - Docker Management Script
# Author: Samuel (Sami)
# Date: January 23, 2026

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_info() {
    echo -e "${BLUE}ℹ ${1}${NC}"
}

print_success() {
    echo -e "${GREEN}✓ ${1}${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ ${1}${NC}"
}

print_error() {
    echo -e "${RED}✗ ${1}${NC}"
}

print_header() {
    echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Function to check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running!"
        print_info "Please start Docker Desktop and try again."
        exit 1
    fi
}

# Function to check if docker-compose is available
check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "docker-compose is not installed!"
        print_info "Please install Docker Compose and try again."
        exit 1
    fi
}

# Function to start the application
start() {
    print_header "Starting Task Manager Application"
    check_docker
    check_docker_compose
    
    print_info "Building and starting all services..."
    docker-compose up --build -d
    
    print_success "Services started successfully!"
    print_info "Waiting for services to be ready..."
    sleep 5
    
    echo ""
    print_success "Application is running!"
    echo ""
    echo -e "  ${BLUE}Frontend:${NC}      ${GREEN}http://localhost${NC}"
    echo -e "  ${BLUE}API:${NC}           ${GREEN}http://localhost/api${NC}"
    echo -e "  ${BLUE}Admin Panel:${NC}   ${GREEN}http://localhost/admin${NC}"
    echo -e "  ${BLUE}Swagger UI:${NC}    ${GREEN}http://localhost/api/docs${NC}"
    echo -e "  ${BLUE}ReDoc API:${NC}     ${GREEN}http://localhost/api/redoc${NC}"
    echo ""
    print_info "To view logs, run: ${YELLOW}./run.sh logs${NC}"
    print_info "To stop, run: ${YELLOW}./run.sh stop${NC}"
    echo ""
}

# Function to start without rebuilding
start_no_build() {
    print_header "Starting Task Manager Application (without rebuild)"
    check_docker
    check_docker_compose
    
    print_info "Starting all services..."
    docker-compose up -d
    
    print_success "Services started successfully!"
    echo ""
    echo -e "  ${BLUE}Frontend:${NC}      ${GREEN}http://localhost${NC}"
    echo -e "  ${BLUE}API:${NC}           ${GREEN}http://localhost/api${NC}"
    echo -e "  ${BLUE}Admin Panel:${NC}   ${GREEN}http://localhost/admin${NC}"
    echo -e "  ${BLUE}Swagger UI:${NC}    ${GREEN}http://localhost/api/docs${NC}"
    echo -e "  ${BLUE}ReDoc API:${NC}     ${GREEN}http://localhost/api/redoc${NC}"
    echo ""
}

# Function to stop the application
stop() {
    print_header "Stopping Task Manager Application"
    check_docker_compose
    
    print_info "Stopping all services..."
    docker-compose down
    
    print_success "Services stopped successfully!"
}

# Function to restart the application
restart() {
    print_header "Restarting Task Manager Application"
    stop
    sleep 2
    start_no_build
}

# Function to view logs
logs() {
    print_header "Viewing Application Logs"
    check_docker_compose
    
    if [ -z "$1" ]; then
        print_info "Showing logs for all services (Ctrl+C to exit)..."
        docker-compose logs -f
    else
        print_info "Showing logs for service: $1 (Ctrl+C to exit)..."
        docker-compose logs -f "$1"
    fi
}

# Function to check status
status() {
    print_header "Service Status"
    check_docker_compose
    
    docker-compose ps
}

# Function to clean everything
clean() {
    print_header "Cleaning Task Manager Application"
    check_docker_compose
    
    print_warning "This will remove all containers, volumes, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Stopping and removing all services and volumes..."
        docker-compose down -v
        print_success "Cleanup complete!"
    else
        print_info "Cleanup cancelled."
    fi
}

# Function to create superuser
create_superuser() {
    print_header "Create Django Superuser"
    check_docker_compose
    
    print_info "Creating superuser..."
    docker-compose exec backend python manage.py createsuperuser
}

# Function to run Django migrations
migrate() {
    print_header "Running Database Migrations"
    check_docker_compose
    
    print_info "Running migrations..."
    docker-compose exec backend python manage.py migrate
    print_success "Migrations completed!"
}

# Function to access database shell
db_shell() {
    print_header "PostgreSQL Database Shell"
    check_docker_compose
    
    print_info "Connecting to PostgreSQL..."
    print_info "Commands: \\dt (list tables), \\q (quit)"
    docker-compose exec db psql -U postgres -d taskmanager
}

# Function to run Django shell
django_shell() {
    print_header "Django Shell"
    check_docker_compose
    
    print_info "Starting Django shell..."
    docker-compose exec backend python manage.py shell
}

# Function to rebuild without cache
rebuild() {
    print_header "Rebuilding Application (no cache)"
    check_docker
    check_docker_compose
    
    print_info "Stopping services..."
    docker-compose down
    
    print_info "Rebuilding with --no-cache..."
    docker-compose build --no-cache
    
    print_info "Starting services..."
    docker-compose up -d
    
    print_success "Rebuild complete!"
}

# Function to show help
show_help() {
    cat << EOF
${BLUE}Task Manager Application - Docker Management Script${NC}

${GREEN}Usage:${NC}
  ./run.sh [command]

${GREEN}Commands:${NC}
  ${YELLOW}start${NC}              Build and start all services
  ${YELLOW}start-fast${NC}         Start services without rebuilding
  ${YELLOW}stop${NC}               Stop all services
  ${YELLOW}restart${NC}            Restart all services
  ${YELLOW}status${NC}             Show status of all services
  ${YELLOW}logs [service]${NC}     View logs (all or specific service)
  ${YELLOW}clean${NC}              Stop and remove all containers and volumes
  
  ${YELLOW}superuser${NC}          Create Django superuser
  ${YELLOW}migrate${NC}            Run database migrations
  ${YELLOW}dbshell${NC}            Open PostgreSQL shell
  ${YELLOW}shell${NC}              Open Django shell
  ${YELLOW}rebuild${NC}            Rebuild application without cache
  
  ${YELLOW}help${NC}               Show this help message

${GREEN}Examples:${NC}
  ./run.sh start              # Start the application
  ./run.sh logs backend       # View backend logs
  ./run.sh superuser          # Create admin user
  ./run.sh stop               # Stop the application

${GREEN}Service Names:${NC}
  - backend    (Django API)
  - frontend   (Next.js)
  - db         (PostgreSQL)
  - nginx      (Reverse Proxy)

${GREEN}URLs:${NC}
  - Frontend:     http://localhost
  - API:          http://localhost/api
  - Admin Panel:  http://localhost/admin
  - Swagger UI:   http://localhost/api/docs
  - ReDoc API:    http://localhost/api/redoc
  

EOF
}

# Main script logic
case "$1" in
    start)
        start
        ;;
    start-fast)
        start_no_build
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    logs)
        logs "$2"
        ;;
    status)
        status
        ;;
    clean)
        clean
        ;;
    superuser)
        create_superuser
        ;;
    migrate)
        migrate
        ;;
    dbshell)
        db_shell
        ;;
    shell)
        django_shell
        ;;
    rebuild)
        rebuild
        ;;
    help|--help|-h)
        show_help
        ;;
    "")
        print_error "No command specified!"
        echo ""
        show_help
        exit 1
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

