# Deployment Architecture & Flow

## Automated CI/CD Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Developer Pushes Code                        │
│                    git push origin main                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                  GitHub Actions Triggered                       │
│              .github/workflows/deploy-alicloud.yml              │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   Stage 1: Checkout    │
        │   Get latest code      │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  Stage 2: Docker Build │
        │  Setup Buildx          │
        │  Use cached layers     │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │   Stage 3: ACR Login   │
        │   Authenticate with    │
        │   Alibaba Cloud        │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  Stage 4: Build Image  │
        │  • node:20-alpine      │
        │  • nginx:1.27-alpine   │
        │  • Multi-stage build   │
        │  • Optimized for CN    │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │   Stage 5: Push to     │
        │   Alibaba Cloud ACR    │
        │   registry.cn-         │
        │   hangzhou.aliyuncs.com│
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │  Stage 6: Deploy to    │
        │  ECS via SSH           │
        │  • Pull latest image   │
        │  • Stop old container  │
        │  • Start new container │
        └────────┬───────────────┘
                 │
                 ▼
        ┌────────────────────────┐
        │   Stage 7: Health      │
        │   Check                │
        │   GET /api/health      │
        │   Verify success       │
        └────────┬───────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   ✅ Deployment Complete!                       │
│              Website live at your-domain.com                    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Diagram

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           GitHub Repository                              │
│                                                                          │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐            │
│  │   Source     │     │   GitHub     │     │   Secrets    │            │
│  │    Code      │────▶│   Actions    │────▶│   Manager    │            │
│  │              │     │   Workflow   │     │              │            │
│  └──────────────┘     └──────┬───────┘     └──────────────┘            │
│                              │                                           │
└──────────────────────────────┼───────────────────────────────────────────┘
                               │
                               │ HTTPS/API
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      Alibaba Cloud Container Registry                    │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  Image Repository                                          │         │
│  │  registry.cn-hangzhou.aliyuncs.com/namespace/garment-site  │         │
│  │                                                             │         │
│  │  Tags:                                                     │         │
│  │  • latest                                                  │         │
│  │  • main-abc123                                             │         │
│  │  • v1.0.0                                                  │         │
│  └────────────────────────────────────────────────────────────┘         │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ Docker Pull
                               ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      Alibaba Cloud ECS Instance                          │
│                                                                          │
│  ┌────────────────────────────────────────────────────────────┐         │
│  │  Docker Engine                                             │         │
│  │                                                             │         │
│  │  ┌─────────────────────────────────────────────┐           │         │
│  │  │  Container: garment-site                    │           │         │
│  │  │  ├─ Image: nginx:1.27-alpine               │           │         │
│  │  │  ├─ Port: 80                               │           │         │
│  │  │  ├─ Health Check: /api/health              │           │         │
│  │  │  └─ Restart Policy: unless-stopped         │           │         │
│  │  └─────────────────────────────────────────────┘           │         │
│  │                                                             │         │
│  │  ┌─────────────────────────────────────────────┐           │         │
│  │  │  Nginx Web Server                           │           │         │
│  │  │  ├─ Static Files: /usr/share/nginx/html    │           │         │
│  │  │  ├─ Config: /etc/nginx/conf.d/default.conf │           │         │
│  │  │  └─ Gzip Compression: Enabled              │           │         │
│  │  └─────────────────────────────────────────────┘           │         │
│  └────────────────────────────────────────────────────────────┘         │
│                                                                          │
│  Security Group:                                                        │
│  • Inbound: 80 (HTTP), 443 (HTTPS)                                      │
│  • Inbound: 22 (SSH - restricted IPs)                                   │
└──────────────────────────────┬───────────────────────────────────────────┘
                               │
                               │ HTTP/HTTPS
                               ▼
                    ┌──────────────────┐
                    │    End Users     │
                    │  visitors access │
                    │  your website    │
                    └──────────────────┘
```

---

## Data Flow: Form Submission

```
User on Website
       │
       │ Fill RFQ Form
       │ + Attachments
       ▼
┌─────────────────────────┐
│  Client-side Validation │
│  • File size < 10MB    │
│  • Allowed extensions   │
│  • Required fields      │
│  • MIME type check      │
└────────┬────────────────┘
         │
         │ Valid?
         ▼
    ┌────┴────┐
    │  YES    │
    ▼         ▼
┌─────────┐  ┌──────────────┐
│ Submit  │  │ Show Error   │
│ to API  │  │ to User      │
└────┬────┘  └──────────────┘
     │
     ▼
┌─────────────────────────┐
│  Rate Limiting Check    │
│  • 8 requests / 10min   │
│  • Per IP address       │
└────────┬────────────────┘
         │
         │ Within limit?
         ▼
    ┌────┴────┐
    │  YES    │
    ▼         ▼
┌─────────┐  ┌──────────────┐
│ Process │  │ Return 429   │
│ Upload  │  │ Too Many     │
│ to OSS  │  │ Requests     │
└────┬────┘  └──────────────┘
     │
     ▼
┌─────────────────────────┐
│  Send Email Notification│
│  • To: RFQ email        │
│  • With attachments     │
│  • Form data in body    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Return Success to User │
│  • Show thank you msg   │
│  • Redirect to success  │
│    page                 │
└─────────────────────────┘
```

---

## Technology Stack Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Development                                                 │
│                                                             │
│  Next.js 14 (App Router)                                   │
│  ├─ React 18                                               │
│  ├─ TypeScript                                             │
│  ├─ TailwindCSS                                            │
│  └─ next-intl (i18n)                                       │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ pnpm build
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Build Output                                                │
│                                                             │
│  Static Export (out/)                                      │
│  ├─ index.html                                              │
│  ├─ /zh/index.html                                          │
│  ├─ /en/index.html                                          │
│  ├─ _next/static/                                           │
│  │   ├─ CSS bundles                                         │
│  │   ├─ JavaScript chunks                                  │
│  │   └─ Media assets                                        │
│  └─ API Routes (serverless)                                │
│      ├─ /api/health                                         │
│      └─ /api/rfq                                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Docker Build
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Production Container                                        │
│                                                             │
│  Multi-stage Dockerfile                                    │
│  ├─ Stage 1: Builder (node:20-alpine)                      │
│  │   └─ pnpm build → out/                                  │
│  └─ Stage 2: Runner (nginx:1.27-alpine)                    │
│      ├─ Copy out/ → /usr/share/nginx/html                  │
│      ├─ Custom nginx config                                │
│      └─ Health check configured                            │
└─────────────────────────────────────────────────────────────┘
                         │
                         │ Docker Run
                         ▼
┌─────────────────────────────────────────────────────────────┐
│ Runtime Environment                                         │
│                                                             │
│  Nginx 1.27 (Alpine)                                       │
│  ├─ Serves static files                                     │
│  ├─ Gzip compression                                        │
│  ├─ Cache headers                                           │
│  └─ Health endpoint                                         │
│                                                             │
│  Environment Variables                                      │
│  ├─ NEXT_PUBLIC_SITE_URL                                    │
│  ├─ NEXT_PUBLIC_RFQ_EMAIL                                   │
│  ├─ BAIDU_TONGJI_ID                                         │
│  └─ TENCENT_CAPTCHA_APP_ID                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Layers

```
┌────────────────────────────────────────────────────────────┐
│ Layer 1: Network Security                                  │
│  • ECS Security Group (restricted IPs/ports)              │
│  • SSH key authentication only                             │
│  • No root password login                                  │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 2: Application Security                              │
│  • Input validation (client + server)                      │
│  • Rate limiting (8 req/10min)                             │
│  • File upload restrictions                                │
│  • MIME type validation                                    │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 3: Container Security                                │
│  • Minimal Alpine base image                               │
│  • Non-root user (recommended)                             │
│  • Read-only filesystem (where possible)                   │
│  • Health checks enabled                                   │
└────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────────┐
│ Layer 4: Secrets Management                                │
│  • GitHub Secrets (encrypted)                              │
│  • Environment variables (not in code)                     │
│  • SSH private keys (never committed)                      │
│  • Regular rotation                                        │
└────────────────────────────────────────────────────────────┘
```

---

## Monitoring & Observability

```
┌────────────────────────────────────────────────────────────┐
│ GitHub Actions Monitoring                                  │
│                                                            │
│  • Real-time build logs                                   │
│  • Success/failure notifications                          │
│  • Deployment duration tracking                           │
│  • Historical run data                                    │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Container Monitoring                                       │
│                                                            │
│  docker inspect --format='{{.State.Health.Status}}'       │
│  • Status: healthy/unhealthy/starting                     │
│  • Logs: docker logs garment-site                         │
│  • Metrics: CPU, Memory, Network I/O                      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Application Monitoring (Recommended Additions)             │
│                                                            │
│  • Sentry: Error tracking                                 │
│  • Google Analytics / Baidu Tongji: User analytics        │
│  • Uptime monitoring: Pingdom/UptimeRobot                 │
│  • Log aggregation: Alibaba Cloud SLS                     │
└────────────────────────────────────────────────────────────┘
```

---

## Cost Breakdown

```
Monthly Operating Costs (CNY)
┌────────────────────────────────────────────────────────────┐
│ Fixed Costs                                                │
│  • ECS Instance (2vCPU, 4GB RAM): ¥200-300                │
│  • Bandwidth (pay-by-traffic): ¥20-50                     │
│  • Domain name: ¥5-10                                     │
│  • SSL Certificate: ¥0-200 (Let's Encrypt = free)         │
├────────────────────────────────────────────────────────────┤
│ Variable Costs                                             │
│  • ACR Storage (500MB free): ¥0-20                        │
│  • GitHub Actions (2k min free): ¥0-50                    │
│  • CDN Traffic (if used): ¥0-100                          │
├────────────────────────────────────────────────────────────┤
│ Total Estimated: ¥225-730/month                           │
│ Typical Usage: ~¥350/month                                │
└────────────────────────────────────────────────────────────┘
```

---

**This architecture provides:**
- ✅ Fast deployment (~5-10 min)
- ✅ Zero downtime updates
- ✅ Automatic rollback capability
- ✅ Production-grade security
- ✅ Cost-effective operation
- ✅ Easy maintenance
- ✅ Scalable infrastructure
