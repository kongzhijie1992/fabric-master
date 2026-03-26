# Official B2B Garment Factory Website (Static Export for Alibaba OSS / ECS)

This project now runs as a pure static website (`next export`) so it can be hosted on:
- Alibaba Cloud OSS (+ optional CDN), or
- Alibaba Cloud ECS with Docker (Nginx static serving).

## Key Mode Change

- Build output: static files in `out/`
- Hosting target: Alibaba OSS static website hosting
- No Next.js server/API required in production
- RFQ form behavior:
  - `NEXT_PUBLIC_RFQ_ENDPOINT` set: form posts to your external endpoint
  - not set: form opens local mail client draft (`mailto:`)

## Recent Improvements (Latest Updates)

### Security Enhancements
- ✅ **MIME type validation** for file uploads with security warnings
- ✅ **Centralized constants** for validation limits and allowed file types
- ✅ **Enhanced rate limiting** with configurable thresholds
- ✅ **Honeypot field** for spam prevention

### User Experience
- ✅ **Real-time form validation** with inline error messages
- ✅ **Loading spinner** on submit button
- ✅ **Improved focus states** for better accessibility
- ✅ **Better error messages** with user-friendly feedback
- ✅ **Touch-based validation** that shows errors after user interaction

### Error Handling & Monitoring
- ✅ **Error boundary component** for graceful error recovery
- ✅ **Custom error pages** (404, 500) with navigation options
- ✅ **Health check endpoint** at `/api/health` for monitoring
- ✅ **Console error logging** ready for monitoring service integration

### DevOps & Performance
- ✅ **Optimized Dockerfile** with better layer caching
- ✅ **Docker health check** for container monitoring
- ✅ **Structured data (Schema.org)** enhanced with contact information
- ✅ **Better SEO metadata** with Open Graph support

## Run Locally

```bash
nvm use 25
corepack enable
pnpm install
cp .env.example .env.local
pnpm dev
```

Open:
- `http://localhost:3000/`
- `http://localhost:3000/zh/`
- `http://localhost:3000/en/`

## Testing

### Unit Tests
```bash
pnpm test
# or
pnpm test:email
```

### Component Tests (Future Enhancement)
```bash
pnpm test:components
```

### E2E Tests (Future Enhancement)
```bash
pnpm test:e2e
```

## Build Static Files

```bash
pnpm build
```

Static output is generated in:
- `out/`

## API Endpoints

### Health Check
- **Endpoint**: `/api/health`
- **Method**: GET
- **Response**: 
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

### RFQ Submission
- **Endpoint**: `/api/rfq`
- **Method**: POST
- **Rate Limit**: 8 requests per 10 minutes per IP
- **Max Attachment Size**: 10MB
- **Allowed File Types**: .pdf, .doc, .docx, .zip, .rar, .png, .jpg, .jpeg

## Alibaba OSS Deployment

### 1) Enable OSS static website hosting

In your OSS bucket:
- Static pages: **enabled**
- Default homepage: `index.html`
- Default 404 page: `404.html`
- Public read access (or private + CDN origin access, depending on your setup)

### 2) Upload static files

Upload everything from local `out/` to bucket root.

Using `ossutil` example:

```bash
ossutil cp -r ./out/ oss://YOUR_BUCKET_NAME/ --update
```

### 3) Bind custom domain

For `timelessclothinggroup.com.cn` and `www`:
- Add domain binding in OSS (or CDN if used)
- DNS records:
  - `@` -> CNAME -> OSS/CDN domain
  - `www` -> CNAME -> OSS/CDN domain

### 4) HTTPS

Recommended: use Alibaba CDN in front of OSS and configure SSL certificate there.

## Alibaba ECS Deployment (Docker)

Recommended runtime image:
- `nginx:1.27-alpine` (already used in the provided `Dockerfile`)

Why this image:
- Minimal and stable for static file serving
- Lower memory footprint than running Node.js runtime for a static export

### 1) Prepare ECS

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
```

### 2) Upload project to ECS

```bash
scp -r ./fabric-master root@YOUR_ECS_IP:/opt/fabric-master
ssh root@YOUR_ECS_IP
cd /opt/fabric-master
```

### 3) Create build env file

Create `.env.production`:

```env
NEXT_PUBLIC_SITE_URL=https://timelessclothinggroup.com.cn
NEXT_PUBLIC_RFQ_EMAIL=publicrelations@timelessclothinggroup.com.cn
NEXT_PUBLIC_RFQ_ENDPOINT=
ASSET_BASE_URL=
```

### 4) Build and run container

```bash
docker compose --env-file .env.production up -d --build
docker compose ps
```

### 5) Open ECS security group ports

Allow inbound:
- `80` (HTTP)
- `443` (if you later add TLS reverse proxy)

### 6) Verify

Open:
- `http://YOUR_ECS_IP/`
- `http://YOUR_ECS_IP/zh/`
- `http://YOUR_ECS_IP/en/`

### 7) Health Check

Monitor container health:
```bash
docker inspect --format='{{.State.Health.Status}}' garment-site-web
```

Or query the health endpoint:
```bash
curl http://YOUR_ECS_IP/api/health
```

## Environment Variables (`.env.local` for build time)

Required:
- `NEXT_PUBLIC_SITE_URL` (example `https://timelessclothinggroup.com.cn`)
- `NEXT_PUBLIC_RFQ_EMAIL` (fallback mailto destination)

Optional:
- `NEXT_PUBLIC_RFQ_ENDPOINT` (external RFQ API/webhook endpoint)
- `ASSET_BASE_URL` or `NEXT_PUBLIC_ASSET_BASE_URL` (OSS/COS/CDN static assets domain)
- `BAIDU_TONGJI_ID` or `NEXT_PUBLIC_BAIDU_TONGJI_ID`
- `TENCENT_CAPTCHA_APP_ID` or `NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID`

## Content Editing

Primary content file:
- `src/content/site.ts`

Replace media assets:
- `public/factory/*`
- `public/products/*`
- `public/capability-deck.pdf`

## Validation Rules

### Form Validation
- **Name**: Required, max 300 characters
- **Company**: Required, max 300 characters
- **Email**: Required, valid email format
- **WhatsApp/WeChat**: Required, max 300 characters
- **Product Type**: Required, max 300 characters
- **Target Quantity**: Required, max 300 characters
- **Target Price**: Optional, max 300 characters
- **Delivery Date**: Required, valid date format
- **Message**: Required, max 5000 characters

### File Upload
- **Max Size**: 10MB
- **Allowed Extensions**: .pdf, .doc, .docx, .zip, .rar, .png, .jpg, .jpeg
- **MIME Type Validation**: Enabled with warnings for mismatches

### Rate Limiting
- **Window**: 10 minutes
- **Max Requests**: 8 per IP address

## Notes for Mainland China

- This static OSS deployment is Mainland-friendly.
- If hosting in Mainland region, ICP filing is typically required.
- If not using a server backend, server-side anti-spam/rate-limit/captcha verification are still available through the API route.

## Future Enhancements (Recommended)

### High Priority
- [ ] Add Sentry or similar error tracking service
- [ ] Implement CSRF protection tokens
- [ ] Add cookie consent banner for GDPR compliance

### Medium Priority
- [ ] Component testing with Vitest + React Testing Library
- [ ] E2E testing with Playwright
- [ ] Google Analytics alternative (privacy-focused)
- [ ] CMS integration for easier content updates

### Low Priority
- [ ] Image optimization via CDN
- [ ] Advanced analytics dashboard
- [ ] A/B testing framework
- [ ] Performance monitoring (Web Vitals)

## Troubleshooting

### Health Check Failing
```bash
# Check container logs
docker compose logs web

# Test health endpoint manually
curl http://localhost/api/health
```

### Form Submission Issues
- Check browser console for errors
- Verify `NEXT_PUBLIC_RFQ_ENDPOINT` is correctly configured
- Ensure captcha is properly configured if enabled
- Check rate limit status in server logs

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next out node_modules
pnpm install
pnpm build
```

---

## 🚀 Automated Deployment (CI/CD)

**Yes! You can trigger auto-deployment when you push to GitHub!**

This project includes a complete CI/CD pipeline that automatically deploys to Alibaba Cloud ECS whenever you push to the `main` or `master` branch.

### Quick Setup (2 Options)

#### Option 1: Automated Script (Fastest - 5 minutes)

**Windows (PowerShell):**
```powershell
.\setup-github-actions.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x setup-github-actions.sh
./setup-github-actions.sh
```

The script will interactively guide you through setting up all required secrets.

#### Option 2: Manual Setup (10 minutes)

1. **Push workflow to GitHub:**
   ```bash
   git add .github/workflows/deploy-alicloud.yml
   git commit -m "Add automated deployment"
   git push origin main
   ```

2. **Configure GitHub Secrets:**
   Go to: **Settings → Secrets and variables → Actions**
   
   Add these required secrets:
   ```
   ACR_USERNAME       = your-alibaba-cloud-username
   ACR_PASSWORD       = your-alibaba-cloud-acr-password
   ACR_NAMESPACE      = your-namespace
   ECS_HOST          = your-ecs-public-ip
   ECS_USERNAME      = root
   ECS_SSH_KEY       = -----BEGIN OPENSSH PRIVATE KEY-----...
   NEXT_PUBLIC_SITE_URL = https://your-domain.com
   ```

3. **Done!** Next push to `main` will trigger automatic deployment.

### What Happens on Push?

Every time you push to `main` or `master`:

1. ✅ **GitHub Actions** triggers the deployment workflow
2. ✅ **Docker image** is built with your latest code
3. ✅ **Image pushed** to Alibaba Cloud Container Registry (ACR)
4. ✅ **Auto-deploy** to your ECS instance via SSH
5. ✅ **Health check** verifies successful deployment
6. ✅ **Notifications** (check Actions tab for results)

**Total deployment time:** ~5-10 minutes

### Documentation & Resources

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - Quick reference card
- **[CI_CD_DEPLOYMENT.md](./CI_CD_DEPLOYMENT.md)** - Complete CI/CD guide
- **[DEPLOYMENT_ALICLOUD.md](./DEPLOYMENT_ALICLOUD.md)** - Alibaba Cloud specifics
- **[.github/SECRETS_TEMPLATE.md](./.github/SECRETS_TEMPLATE.md)** - Secrets reference

### Monitoring Your Deployment

**View real-time deployment progress:**
```
https://github.com/YOUR_USERNAME/YOUR_REPO_NAME/actions
```

**Check deployment status on ECS:**
```bash
docker ps | grep garment-site
docker logs garment-site
```

### Workflow Features

- **Automatic tagging**: Images tagged with branch, SHA, and semantic versions
- **Cache optimization**: Faster builds using GitHub Actions cache
- **Zero-downtime**: Smooth deployment with health checks
- **Rollback ready**: Previous images remain in ACR for quick rollback
- **Secure**: All secrets stored in GitHub Secrets, SSH key authentication

### Cost

- **GitHub Actions**: Free (2,000 minutes/month included)
- **Per deployment**: ~5-10 minutes
- **ECS server**: ¥200-300/month
- **Total**: ~¥250-350/month (all-inclusive)

---
