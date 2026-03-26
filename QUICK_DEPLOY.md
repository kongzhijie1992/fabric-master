# 🚀 Quick Deploy Reference Card

## One-Command Setup

### Windows (PowerShell)
```powershell
.\setup-github-actions.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x setup-github-actions.sh && ./setup-github-actions.sh
```

---

## Manual Setup (5 Minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Setup auto-deployment"
git push origin main
```

### 2. Add Required Secrets
Go to: **Settings → Secrets and variables → Actions**

**Minimum Required:**
```
ACR_USERNAME       = your-alibaba-username
ACR_PASSWORD       = your-alibaba-password  
ACR_NAMESPACE      = your-namespace
ECS_HOST          = your-ecs-ip
ECS_USERNAME      = root
ECS_SSH_KEY       = -----BEGIN OPENSSH PRIVATE KEY-----...
NEXT_PUBLIC_SITE_URL = https://your-domain.com
```

### 3. Done! 🎉
Next push to `main` will trigger automatic deployment.

---

## Monitor Deployment

**GitHub Actions Tab:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO/actions
```

**Deployment Time:** ~5-10 minutes

---

## Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Build fails | Check `pnpm-lock.yaml` is committed |
| SSH fails | Verify security group allows port 22 |
| Container won't start | Check logs: `docker logs garment-site` |
| Health check fails | Wait 30s, application needs to initialize |

---

## Useful Commands

**Check deployment status:**
```bash
docker ps | grep garment-site
docker logs garment-site
```

**Manual redeploy:**
```bash
ssh root@your-ecs-ip
docker pull registry.cn-hangzhou.aliyuncs.com/namespace/garment-site:latest
docker restart garment-site
```

**View workflow logs:**
```bash
gh run watch
```

---

## Files Created

✅ `.github/workflows/deploy-alicloud.yml` - CI/CD pipeline  
✅ `.github/SECRETS_TEMPLATE.md` - Secrets reference  
✅ `setup-github-actions.sh` - Auto-setup (Linux/Mac)  
✅ `setup-github-actions.ps1` - Auto-setup (Windows)  
✅ `CI_CD_DEPLOYMENT.md` - Complete guide  

---

## Cost

- **GitHub Actions**: Free (2,000 min/month included)
- **Deployment time**: ~5-10 min per deploy
- **ECS server**: ¥200-300/month
- **Total**: ~¥250-350/month all-in

---

## Support

Need help? See full documentation:
- [CI_CD_DEPLOYMENT.md](./CI_CD_DEPLOYMENT.md) - Complete guide
- [DEPLOYMENT_ALICLOUD.md](./DEPLOYMENT_ALICLOUD.md) - Alibaba Cloud specifics
