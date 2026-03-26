#!/bin/bash

# Alibaba Cloud Quick Deployment Script
# Estimated Time: 5-10 minutes

set -e

# Configuration
ACR_REGISTRY="registry.cn-hangzhou.aliyuncs.com"
ACR_NAMESPACE="${ALIBABA_CLOUD_NAMESPACE:-your-namespace}"
IMAGE_NAME="garment-site"
IMAGE_TAG="latest"
ECS_USER="${ECS_USER:-root}"
ECS_HOST="${ECS_HOST}"

echo "🚀 Starting Alibaba Cloud Deployment..."
echo ""

# Step 1: Build the image
echo "📦 Building Docker image..."
docker build -t ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} .

# Step 2: Login to ACR
echo "🔐 Logging in to Alibaba Cloud Container Registry..."
if [ -z "$ACR_PASSWORD" ]; then
    read -p "Enter your Alibaba Cloud ACR password: " -s ACR_PASSWORD
    echo ""
fi
echo "$ACR_PASSWORD" | docker login --username="$ACR_USERNAME" --password-stdin $ACR_REGISTRY

# Step 3: Push to ACR
echo "📤 Pushing image to ACR..."
docker push ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}

# Step 4: Deploy to ECS (if host is provided)
if [ ! -z "$ECS_HOST" ]; then
    echo "🖥️  Deploying to ECS instance..."
    
    # SSH and deploy
    ssh ${ECS_USER}@${ECS_HOST} << 'ENDSSH'
        # Pull latest image
        docker pull ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}
        
        # Stop old container
        docker stop garment-site || true
        docker rm garment-site || true
        
        # Run new container
        docker run -d \
          --name garment-site \
          --restart unless-stopped \
          -p 80:80 \
          ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}
        
        echo "✅ Deployment complete!"
        docker ps --filter "name=garment-site"
ENDSSH
    
    echo ""
    echo "🎉 Deployment successful!"
    echo "Website will be available at: http://${ECS_HOST}"
else
    echo ""
    echo "✅ Image pushed to ACR successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Go to Alibaba Cloud Console → Container Service"
    echo "2. Create application using image: ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
    echo "3. Or deploy to ECS manually:"
    echo "   docker run -d --name garment-site -p 80:80 ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
fi

echo ""
echo "📊 Deployment Summary:"
echo "  - Image: ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG}"
echo "  - Size: $(docker images ${ACR_REGISTRY}/${ACR_NAMESPACE}/${IMAGE_NAME}:${IMAGE_TAG} --format '{{.Size}}')"
echo "  - Created: $(date)"
