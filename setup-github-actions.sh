#!/bin/bash

# GitHub Actions Setup Script for Alibaba Cloud Deployment
# This script helps you configure all required secrets

set -e

echo "🚀 GitHub Actions Setup for Alibaba Cloud Deployment"
echo "===================================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it first: https://cli.github.com/"
    echo "Or manually configure secrets in GitHub Settings → Secrets and variables → Actions"
    echo ""
    exit 1
fi

# Authenticate with GitHub
echo "🔐 Authenticating with GitHub..."
gh auth status || gh auth login

# Get repository info
REPO_OWNER=$(gh repo view --json owner -q '.owner.login')
REPO_NAME=$(gh repo view --json name -q '.name')

echo "✅ Authenticated as: $REPO_OWNER/$REPO_NAME"
echo ""

# Function to set secret
set_secret() {
    local secret_name=$1
    local secret_value=$2
    
    if [ -z "$secret_value" ]; then
        echo -e "${YELLOW}Skipping $secret_name (empty value)${NC}"
        return
    fi
    
    echo "Setting secret: $secret_name"
    gh secret set "$secret_name" --body "$secret_value" --repo "$REPO_OWNER/$REPO_NAME"
    echo -e "${GREEN}✓ $secret_name set successfully${NC}"
}

# Collect ACR credentials
echo "📦 Alibaba Cloud Container Registry Configuration"
echo "------------------------------------------------"
read -p "ACR Username: " ACR_USERNAME
read -sp "ACR Password: " ACR_PASSWORD
echo ""
read -p "ACR Namespace: " ACR_NAMESPACE

set_secret "ACR_USERNAME" "$ACR_USERNAME"
set_secret "ACR_PASSWORD" "$ACR_PASSWORD"
set_secret "ACR_NAMESPACE" "$ACR_NAMESPACE"
echo ""

# Collect ECS credentials
echo "🖥️  ECS Server Configuration"
echo "---------------------------"
read -p "ECS Public IP/Host: " ECS_HOST
read -p "ECS Username (default: root): " ECS_USERNAME
ECS_USERNAME=${ECS_USERNAME:-root}
read -p "ECS SSH Port (default: 22): " ECS_PORT
ECS_PORT=${ECS_PORT:-22}

echo ""
echo -e "${YELLOW}Please paste your SSH Private Key content:${NC}"
echo "(Press Enter twice when done)"
SSH_KEY=""
while IFS= read -r line; do
    if [ -z "$line" ] && [ -n "$SSH_KEY" ]; then
        break
    fi
    SSH_KEY+="$line"$'\n'
done

set_secret "ECS_HOST" "$ECS_HOST"
set_secret "ECS_USERNAME" "$ECS_USERNAME"
set_secret "ECS_PORT" "$ECS_PORT"
set_secret "ECS_SSH_KEY" "$SSH_KEY"
echo ""

# Collect application environment variables
echo "⚙️  Application Environment Variables"
echo "------------------------------------"
read -p "Site URL (NEXT_PUBLIC_SITE_URL): " NEXT_PUBLIC_SITE_URL
read -p "RFQ Endpoint (optional, press Enter to skip): " NEXT_PUBLIC_RFQ_ENDPOINT
read -p "RFQ Email: " NEXT_PUBLIC_RFQ_EMAIL
read -p "Asset Base URL (optional, press Enter to skip): " ASSET_BASE_URL
read -p "Public Asset Base URL (optional, press Enter to skip): " NEXT_PUBLIC_ASSET_BASE_URL
read -p "Baidu Tongji ID (optional, press Enter to skip): " BAIDU_TONGJI_ID
read -p "Public Baidu Tongji ID (optional, press Enter to skip): " NEXT_PUBLIC_BAIDU_TONGJI_ID
read -p "Tencent Captcha App ID (optional, press Enter to skip): " TENCENT_CAPTCHA_APP_ID
read -p "Public Tencent Captcha App ID (optional, press Enter to skip): " NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID

set_secret "NEXT_PUBLIC_SITE_URL" "$NEXT_PUBLIC_SITE_URL"
set_secret "NEXT_PUBLIC_RFQ_ENDPOINT" "$NEXT_PUBLIC_RFQ_ENDPOINT"
set_secret "NEXT_PUBLIC_RFQ_EMAIL" "$NEXT_PUBLIC_RFQ_EMAIL"
set_secret "ASSET_BASE_URL" "$ASSET_BASE_URL"
set_secret "NEXT_PUBLIC_ASSET_BASE_URL" "$NEXT_PUBLIC_ASSET_BASE_URL"
set_secret "BAIDU_TONGJI_ID" "$BAIDU_TONGJI_ID"
set_secret "NEXT_PUBLIC_BAIDU_TONGJI_ID" "$NEXT_PUBLIC_BAIDU_TONGJI_ID"
set_secret "TENCENT_CAPTCHA_APP_ID" "$TENCENT_CAPTCHA_APP_ID"
set_secret "NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID" "$NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID"
echo ""

# Verify all secrets are set
echo "✅ Verifying secrets..."
SECRETS=(
    "ACR_USERNAME"
    "ACR_PASSWORD"
    "ACR_NAMESPACE"
    "ECS_HOST"
    "ECS_USERNAME"
    "ECS_PORT"
    "ECS_SSH_KEY"
    "NEXT_PUBLIC_SITE_URL"
    "NEXT_PUBLIC_RFQ_EMAIL"
)

ALL_SET=true
for secret in "${SECRETS[@]}"; do
    if gh secret list --repo "$REPO_OWNER/$REPO_NAME" | grep -q "$secret"; then
        echo -e "${GREEN}✓ $secret${NC}"
    else
        echo -e "${RED}✗ $secret (missing)${NC}"
        ALL_SET=false
    fi
done

echo ""
if [ "$ALL_SET" = true ]; then
    echo -e "${GREEN}🎉 All required secrets configured successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Push your code to GitHub:"
    echo "   git add ."
    echo "   git commit -m 'Add GitHub Actions workflow'"
    echo "   git push origin main"
    echo ""
    echo "2. The deployment will start automatically!"
    echo "   View progress at: https://github.com/$REPO_OWNER/$REPO_NAME/actions"
    echo ""
else
    echo -e "${YELLOW}⚠️  Some secrets are missing. Please configure them manually in GitHub Settings.${NC}"
    echo "   https://github.com/$REPO_OWNER/$REPO_NAME/settings/secrets/actions"
fi
