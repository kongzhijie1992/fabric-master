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

## Test Email Notifier Logic

Run this after changing SMTP notifier code:

```bash
pnpm test:email
```

## Build Static Files

```bash
pnpm build
```

Static output is generated in:
- `out/`

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

## Notes for Mainland China

- This static OSS deployment is Mainland-friendly.
- If hosting in Mainland region, ICP filing is typically required.
- If not using a server backend, server-side anti-spam/rate-limit/captcha verification are not available.
