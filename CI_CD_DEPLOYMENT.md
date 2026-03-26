# CI/CD Deployment Guide

## Automated Deployment with GitHub Actions

This project includes a complete CI/CD pipeline that automatically deploys your Next.js application to Alibaba Cloud whenever you push code to the `main` or `master` branch.

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

#### For Windows (PowerShell):
```powershell
.\setup-github-actions.ps1
```

#### For Linux/Mac (Bash):
```bash
chmod +x setup-github-actions.sh
./setup-github-actions.sh
```

The script will:
1. Authenticate you with GitHub
2. Prompt you for all required credentials
3. Configure all GitHub Secrets automatically
4. Verify the configuration

### Option 2: Manual Setup

Follow the detailed steps below.

---

## 📋 Step-by-Step Manual Configuration

### Step 1: Create GitHub Repository

```bash
# Initialize git repository (if not already done)
git init
git add .
git commit -m "Initial commit"

# Add your GitHub remote and push
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### Step 2: Configure GitHub Secrets

Go to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

Add the following secrets:

#### Alibaba Cloud Container Registry (ACR)
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ACR_USERNAME` | Your Alibaba Cloud username | `aliyun-user` |
| `ACR_PASSWORD` | Your ACR password | `your-acr-password` |
| `ACR_NAMESPACE` | Your ACR namespace | `my-namespace` |

#### ECS Server Configuration
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `ECS_HOST` | ECS public IP address | `47.100.xx.xx` |
| `ECS_USERNAME` | SSH username | `root` |
| `ECS_PORT` | SSH port | `22` |
| `ECS_SSH_KEY` | SSH private key | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

#### Application Environment Variables
| Secret Name | Description | Example |
|-------------|-------------|---------|
| `NEXT_PUBLIC_SITE_URL` | Your website URL | `https://example.com` |
| `NEXT_PUBLIC_RFQ_ENDPOINT` | RFQ API endpoint | *(optional)* |
| `NEXT_PUBLIC_RFQ_EMAIL` | Contact email | `info@example.com` |
| `ASSET_BASE_URL` | CDN base URL | `https://cdn.example.com` |
| `NEXT_PUBLIC_ASSET_BASE_URL` | Public CDN URL | `https://cdn.example.com` |
| `BAIDU_TONGJI_ID` | Baidu Analytics ID | `xxxxxxxx` |
| `NEXT_PUBLIC_BAIDU_TONGJI_ID` | Public Baidu ID | `xxxxxxxx` |
| `TENCENT_CAPTCHA_APP_ID` | Tencent Captcha ID | `xxxxxxxx` |
| `NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID` | Public Captcha ID | `xxxxxxxx` |

### Step 3: Push to Trigger Deployment

```bash
git add .github/workflows/deploy-alicloud.yml
git commit -m "Add GitHub Actions deployment workflow"
git push origin main
```

The deployment will start automatically! 🎉

---

## 🔍 Monitoring Your Deployment

### View Deployment Progress

1. Go to **Actions** tab in your GitHub repository
2. Click on the running workflow
3. Watch real-time logs

### Deployment Stages

The workflow performs these steps:
1. ✅ Checkout code
2. ✅ Setup Docker Buildx
3. ✅ Login to Alibaba Cloud ACR
4. ✅ Build Docker image
5. ✅ Push image to ACR
6. ✅ Deploy to ECS via SSH
7. ✅ Health check

---

## ⚙️ Workflow Configuration

The deployment workflow is defined in `.github/workflows/deploy-alicloud.yml`

### Triggers
- **Push** to `main` or `master` branch → Full deployment
- **Pull Request** → Build only (no deployment)

### Features
- **Automatic tagging**: Images are tagged with branch name, commit SHA, and semantic versions
- **Latest tag**: Only pushes to `main/master` get the `latest` tag
- **Cache optimization**: Uses GitHub Actions cache for faster builds
- **Health checks**: Automatically verifies deployment success
- **Rollback support**: Previous images remain in ACR

---

## 🛠️ Troubleshooting

### Deployment Fails at "Login to ACR"
**Solution:** Verify your ACR credentials
```bash
docker login registry.cn-hangzhou.aliyuncs.com
```

### SSH Connection Fails
**Solutions:**
1. Check ECS security group allows port 22
2. Verify SSH key permissions:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```
3. Test SSH connection manually:
   ```bash
   ssh -i ~/.ssh/id_rsa root@your-ecs-ip
   ```

### Health Check Fails
**Solutions:**
1. Check ECS security group allows port 80
2. Verify container started correctly:
   ```bash
   docker logs garment-site
   ```
3. Check application logs inside container:
   ```bash
   docker exec garment-site cat /var/log/nginx/error.log
   ```

### Build Takes Too Long
**Optimization:**
- The workflow already uses GitHub Actions cache
- Ensure you're using the optimized Dockerfile with Alibaba Cloud mirrors
- Consider using GitHub-hosted runners closer to your region

---

## 🔄 Customization Options

### Deploy to Multiple Environments

Create separate workflows for staging/production:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [ develop ]

# .github/workflows/deploy-production.yml  
on:
  push:
    branches: [ main ]
```

### Add Slack/Discord Notifications

```yaml
- name: Notify Slack
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Add Manual Approval Gate

```yaml
jobs:
  deploy:
    needs: build
    environment: production
    runs-on: ubuntu-latest
```

---

## 💰 Cost Optimization

### GitHub Actions Minutes
- Free tier: 2,000 minutes/month
- Typical deployment: ~5-10 minutes
- Optimize by:
  - Using cache effectively
  - Running on PRs only when necessary
  - Limiting concurrent deployments

### ACR Storage
- Free tier: 500MB storage
- Enable automatic image cleanup:
  ```bash
  # In deployment script
  docker image prune -af --filter "until=24h"
  ```

---

## 📊 Deployment Metrics

Track these metrics in GitHub Actions dashboard:
- **Build time**: Target < 5 minutes
- **Deployment time**: Target < 2 minutes
- **Success rate**: Target > 95%
- **Failed deployments**: Investigate patterns

---

## 🔐 Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets only
2. **Use SSH keys** instead of passwords
3. **Rotate credentials** regularly
4. **Limit workflow permissions**:
   ```yaml
   permissions:
     contents: read
     id-token: write
   ```
5. **Enable branch protection** on main/master
6. **Require PR reviews** before merging

---

## 📞 Support Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Buildx Reference](https://github.com/docker/build-push-action)
- [Alibaba Cloud ACR Guide](https://www.alibabacloud.com/help/en/container-registry)
- [SSH Best Practices](https://www.ssh.com/academy/ssh)

---

## 🎯 Next Steps

After successful automated deployment:

1. **Configure custom domain** in Alibaba Cloud
2. **Set up SSL certificate** (Let's Encrypt or ALB)
3. **Enable CDN** for static assets
4. **Configure monitoring** (CloudMonitor + ARMS)
5. **Set up log aggregation** (SLS)
6. **Implement blue-green deployment** for zero-downtime updates

---

**🎉 You now have a fully automated CI/CD pipeline!**

Every push to `main` or `master` will automatically:
- Build your application
- Create optimized Docker image
- Push to Alibaba Cloud ACR
- Deploy to ECS
- Run health checks
- Notify you of success/failure

Happy deploying! 🚀
