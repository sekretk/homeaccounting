#!/bin/bash

# Development Kubernetes management script
# Usage: ./scripts/k8s-dev.sh [command]

set -e

NAMESPACE="homeaccounting-dev"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_colima() {
    if ! command -v colima &> /dev/null; then
        log_error "Colima not found. Install with: brew install colima"
        exit 1
    fi
    
    if ! colima status &> /dev/null; then
        log_warn "Colima not running. Starting Colima in Kubernetes mode..."
        colima start --kubernetes --cpu 4 --memory 8
        sleep 10
    fi
    
    # Check if running in kubernetes mode
    if ! colima status | grep -q "kubernetes.*true"; then
        log_warn "Colima not running in Kubernetes mode. Restarting..."
        colima stop
        colima start --kubernetes --cpu 4 --memory 8
        sleep 10
    fi
}

check_kubectl() {
    if ! command -v kubectl &> /dev/null; then
        log_error "kubectl not found. Install with: brew install kubectl"
        exit 1
    fi
    
    # Set kubectl context to colima
    kubectl config use-context colima
}

build_images() {
    log_info "Building Docker images..."
    cd "$PROJECT_ROOT"
    
    # Build backend image
    log_info "Building backend image..."
    docker build -f backend/Dockerfile -t homeaccounting-backend:dev .
    
    # Build frontend image  
    log_info "Building frontend image..."
    docker build -f frontend/Dockerfile -t homeaccounting-frontend:dev .
    
    log_info "Images built successfully!"
}

deploy() {
    log_info "Deploying to Kubernetes..."
    
    # Apply manifests
    kubectl apply -f "$PROJECT_ROOT/k8s-dev/"
    
    log_info "Waiting for deployments to be ready..."
    kubectl wait --for=condition=ready pod -l app=postgres -n $NAMESPACE --timeout=60s
    kubectl wait --for=condition=ready pod -l app=backend -n $NAMESPACE --timeout=120s
    kubectl wait --for=condition=ready pod -l app=frontend -n $NAMESPACE --timeout=60s
    
    log_info "Deployment complete!"
    show_status
}

undeploy() {
    log_info "Removing all resources from $NAMESPACE..."
    kubectl delete namespace $NAMESPACE --ignore-not-found=true
    log_info "Cleanup complete!"
}

show_status() {
    log_info "Current status:"
    kubectl get all -n $NAMESPACE
    
    echo ""
    log_info "Access URLs:"
    echo "  Frontend: http://localhost:30080"
    echo "  Backend:  http://localhost:30300"
    echo "  Backend Health: http://localhost:30300/health"
}

show_logs() {
    local service=${2:-backend}
    log_info "Showing logs for $service..."
    kubectl logs -f -l app=$service -n $NAMESPACE
}

restart_service() {
    local service=${2:-backend}
    log_info "Restarting $service..."
    kubectl rollout restart deployment/$service -n $NAMESPACE
    kubectl rollout status deployment/$service -n $NAMESPACE
}

exec_cmd() {
    local service=${2:-backend}
    shift 2
    local cmd="$@"
    
    local pod=$(kubectl get pods -l app=$service -n $NAMESPACE -o jsonpath='{.items[0].metadata.name}')
    if [ -z "$pod" ]; then
        log_error "No pod found for service $service"
        exit 1
    fi
    
    log_info "Executing in $service pod: $cmd"
    kubectl exec -it $pod -n $NAMESPACE -- $cmd
}

case "${1:-help}" in
    "start")
        check_colima
        check_kubectl
        build_images
        deploy
        ;;
    "stop")
        undeploy
        ;;
    "restart")
        restart_service $@
        ;;
    "build")
        build_images
        ;;
    "deploy")
        check_kubectl
        deploy
        ;;
    "status")
        check_kubectl
        show_status
        ;;
    "logs")
        check_kubectl
        show_logs $@
        ;;
    "exec")
        check_kubectl
        exec_cmd $@
        ;;
    "colima")
        case "${2:-help}" in
            "start")
                colima start --kubernetes --cpu 4 --memory 8
                ;;
            "stop")
                colima stop
                ;;
            "status")
                colima status
                ;;
            *)
                echo "Usage: $0 colima [start|stop|status]"
                ;;
        esac
        ;;
    "help"|*)
        echo "Development Kubernetes Management Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  start              - Start Colima, build images, and deploy everything"
        echo "  stop               - Remove all Kubernetes resources"
        echo "  restart [service]  - Restart a service (default: backend)"
        echo "  build              - Build Docker images"
        echo "  deploy             - Deploy to Kubernetes (without building)"
        echo "  status             - Show current status"
        echo "  logs [service]     - Show logs (default: backend)"
        echo "  exec [service] cmd - Execute command in pod"
        echo "  colima start       - Start Colima in Kubernetes mode"
        echo "  colima stop        - Stop Colima"
        echo "  colima status      - Show Colima status"
        echo ""
        echo "Examples:"
        echo "  $0 start                    # Full setup"
        echo "  $0 logs backend             # Backend logs"
        echo "  $0 logs frontend            # Frontend logs"
        echo "  $0 exec backend bash        # Shell into backend pod"
        echo "  $0 restart backend          # Restart backend"
        ;;
esac
