# GitHub Secrets Configuration Template
# =====================================
# Add these secrets to your GitHub repository:
# Settings → Secrets and variables → Actions → New repository secret

# Alibaba Cloud Container Registry (ACR)
ACR_USERNAME=your-alibaba-cloud-username
ACR_PASSWORD=your-alibaba-cloud-acr-password
ACR_NAMESPACE=your-namespace

# ECS Server Configuration
ECS_HOST=your-ecs-public-ip
ECS_USERNAME=root
ECS_PORT=22
ECS_SSH_KEY=-----BEGIN OPENSSH PRIVATE KEY-----\nyour-ssh-private-key\n-----END OPENSSH PRIVATE KEY-----

# Application Environment Variables
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_RFQ_ENDPOINT=
NEXT_PUBLIC_RFQ_EMAIL=your-email@example.com
ASSET_BASE_URL=https://your-cdn-domain.com
NEXT_PUBLIC_ASSET_BASE_URL=https://your-cdn-domain.com
BAIDU_TONGJI_ID=your-baidu-analytics-id
NEXT_PUBLIC_BAIDU_TONGJI_ID=your-baidu-analytics-id
TENCENT_CAPTCHA_APP_ID=your-tencent-captcha-id
NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID=your-tencent-captcha-id
