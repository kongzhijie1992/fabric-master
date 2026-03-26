# Deployment Guide for Alibaba Cloud

## Quick Start (Minimum Lead Time)

### Option 1: Alibaba Cloud Container Registry + ECS ⭐ RECOMMENDED

**Total Deployment Time: ~10 minutes**

#### Prerequisites
- Alibaba Cloud account
- ECS instance (Ubuntu 20.04+ or CentOS 7+)
- Container Registry repository created

#### Step 1: Configure Docker with Alibaba Cloud Mirror

The Dockerfile has been optimized to use Alibaba Cloud's official mirrors:
- Builder: `registry.cn-hangzhou.aliyuncs.com/acs/node:20-alpine`
- Runner: `registry.cn-hangzhou.aliyuncs.com/acs/nginx:1.27-alpine`

#### Step 2: Build and Push to ACR

```bash
# Login to Alibaba Cloud Container Registry
docker login --username=<your-username> registry.cn-hangzhou.aliyuncs.com

# Build the image
docker build -t registry.cn-hangzhou.aliyuncs.com/<your-namespace>/garment-site:latest .

# Push to ACR
docker push registry.cn-hangzhou.aliyuncs.com/<your-namespace>/garment-site:latest
```

#### Step 3: Deploy to ECS

**Method A: Using docker-compose (Simplest)**

```bash
# SSH to your ECS instance
ssh root@<your-ecs-ip>

# Install Docker and docker-compose
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
systemctl enable docker
systemctl start docker

# Pull and run
docker-compose pull
docker-compose up -d
```

**Method B: Direct Docker Run**

```bash
docker run -d \
  --name garment-site \
  --restart unless-stopped \
  -p 80:80 \
  -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  -e NEXT_PUBLIC_RFQ_EMAIL=your-email@example.com \
  registry.cn-hangzhou.aliyuncs.com/<your-namespace>/garment-site:latest
```

#### Step 4: Configure Security Group

In Alibaba Cloud Console:
1. Go to ECS → Security Groups
2. Add rules: HTTP (80), HTTPS (443)

---

### Option 2: Serverless App Engine (SAE) ☁️ No Infrastructure Management

**Total Deployment Time: ~15 minutes**

#### Advantages:
- No server management
- Auto-scaling
- Pay-per-use
- Built-in SLB

#### Steps:

1. **Create SAE Application**
   ```bash
   # In Alibaba Cloud Console: SAE → Create Application
   # Select "Image" as deployment method
   ```

2. **Configure Application**
   - Image: `registry.cn-hangzhou.aliyuncs.com/<your-namespace>/garment-site:latest`
   - Instance: 1 vCPU, 2GB RAM (minimum)
   - Scaling: 1-3 instances

3. **Bind Domain** (optional)
   - Configure custom domain in SAE console

---

### Option 3: Function Compute (FC) 🚀 Event-Driven

**Best for:** Low traffic, cost optimization

```bash
# Deploy using Fun tool
fun deploy
```

---

## Performance Optimization Tips

### 1. Enable CDN
- Alibaba Cloud CDN for static assets
- Configure cache rules for `/_next/static/*`

### 2. Database/R2C Integration
- Use ApsaraDB for MySQL if needed
- Use OSS for file storage

### 3. Monitoring
- Enable CloudMonitor
- Configure ARMS for application monitoring

---

## Environment Variables Template

Create `.env.production`:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_RFQ_ENDPOINT=
NEXT_PUBLIC_RFQ_EMAIL=your-email@example.com
ASSET_BASE_URL=https://cdn.your-domain.com
NEXT_PUBLIC_ASSET_BASE_URL=https://cdn.your-domain.com
BAIDU_TONGJI_ID=your-baidu-analytics-id
TENCENT_CAPTCHA_APP_ID=your-tencent-captcha-id
```

---

## Troubleshooting

### Slow Image Pull
- Ensure you're using Alibaba Cloud mirrors
- Check ECS region matches ACR region

### Port Already in Use
```bash
# Check what's using port 80
netstat -tulpn | grep :80

# Stop conflicting service
systemctl stop nginx
```

### Permission Issues
```bash
# Add user to docker group
usermod -aG docker $USER
newgrp docker
```

---

## Cost Estimation (Monthly)

**ECS Option:**
- ECS (2vCPU, 4GB): ~¥200-300/month
- Bandwidth: ¥20-50/month
- Total: ~¥250-350/month

**SAE Option:**
- Pay-per-use: ~¥100-200/month (low traffic)
- Includes SLB and auto-scaling

**Function Compute:**
- Free tier: 1M requests/month
- Pay-as-you-go thereafter

---

## Support Contacts

- Alibaba Cloud Support: https://workorder-intl.console.aliyun.com
- Docker Documentation: https://docs.docker.com
- Next.js Deployment: https://nextjs.org/docs/deployment