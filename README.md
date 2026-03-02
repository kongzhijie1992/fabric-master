# Official B2B Garment Factory Website (Next.js 14)

Bilingual (Chinese/English) production-ready website for:
- **德州市第二职业中等专业学校服装加工厂**
- Unified Social Credit Code: `91371402MA3CA4N641`
- Legal representative / responsible person: `孔志杰`
- Established: `1991-11-27`
- Business type: `集体经营单位(非法人)`
- Address (CN): `迎宾路（第二职业中等专业学校院内）`

Business scope summary is presented conservatively as garment manufacturing and related apparel/textile products. Scope notes are explicitly marked as **subject to business license registration**.

## Tech Stack

- Next.js 14+ (App Router) + TypeScript
- TailwindCSS
- next-intl (CN/EN)
- SEO: metadata + OpenGraph + `sitemap.xml` + `robots.txt` + JSON-LD Organization
- RFQ form API: file upload + validation + anti-spam

## China-Friendly Engineering

- No Google Fonts CDN usage. Fonts are local (`/public/fonts`) via `next/font/local`.
- No GA / reCAPTCHA by default.
- Anti-spam default: honeypot + server-side IP rate limiting.
- Optional flags:
  - `BAIDU_TONGJI_ID` for Baidu Tongji.
  - `TENCENT_CAPTCHA_APP_ID` + `TENCENT_CAPTCHA_APP_SECRET` for Tencent Captcha.
- Optional static asset offload via `ASSET_BASE_URL` (OSS/COS + CDN compatible).

## Content Configuration

Edit all business-facing content in:
- `src/content/site.ts`

Editable sections include:
- contact info (`phone/email/WeChat/WhatsApp/address`)
- hero copy
- product categories
- capabilities
- QC checkpoints
- FAQ

## Environment Variables

Copy `.env.example` to `.env.local` for local dev.

Required/defaulted variables:
- `NEXT_PUBLIC_SITE_URL` (default `http://localhost:3000`)
- `LEADS_STORE` (default `./data/leads.json`)
- `ASSET_BASE_URL` (optional)
- `EMAIL_PROVIDER` (`none` or `smtp`, default `none`)
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` (required only if `EMAIL_PROVIDER=smtp`)
- `FEISHU_WEBHOOK_URL` (optional)
- `WECOM_WEBHOOK_URL` (optional)
- `BAIDU_TONGJI_ID` (optional)
- `TENCENT_CAPTCHA_APP_ID` (optional)
- `TENCENT_CAPTCHA_APP_SECRET` (optional)

Feature flag behavior:
- `EMAIL_PROVIDER=none`: skip SMTP notification
- empty `FEISHU_WEBHOOK_URL`: skip Feishu
- empty `WECOM_WEBHOOK_URL`: skip WeCom
- empty `BAIDU_TONGJI_ID`: disable analytics loading
- missing Tencent captcha vars: captcha disabled, honeypot + rate-limit still active

## Lead Storage and Notifications

Implemented interface pattern:
- `FileLeadStore` (local/dev JSON file with lock + atomic rename)
- `WebhookNotifier` (Feishu/WeCom)
- `EmailNotifier` (SMTP)

Important production note:
- File storage is not reliable on ephemeral serverless filesystems (e.g. Vercel). In production, rely on Feishu/WeCom/SMTP and/or external DB.

## Local Development

1. Install Node 20 and enable Corepack:
```bash
nvm use 20
corepack enable
```

2. Install dependencies:
```bash
pnpm install
```

3. Create env file:
```bash
cp .env.example .env.local
```

4. Run dev server:
```bash
pnpm dev
```

5. QA checks:
```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Replace Images and Deck

- Replace placeholder images in `public/factory` and `public/products`.
- Replace `public/capability-deck.pdf` with actual deck.
- If using OSS/COS/CDN, upload the same asset paths and set:
  - `ASSET_BASE_URL=https://your-cdn-domain`

When `ASSET_BASE_URL` is set, non-critical assets (product/factory placeholders and capability deck links) are served from CDN base URL.

## Optional OSS/COS + CDN Optimization

1. Upload static files (e.g. `products/*`, `factory/*`, `capability-deck.pdf`) to Aliyun OSS or Tencent COS.
2. Bind custom domain and enable CDN acceleration.
3. Set `ASSET_BASE_URL` to CDN origin (example: `https://assets.example.cn`).
4. Keep same relative file paths as local `/public`.

## Deployment A: Mainland-Friendly (Aliyun/Tencent VM + Docker + Nginx)

### 1) Prepare server

```bash
sudo apt-get update
sudo apt-get install -y docker.io docker-compose-plugin certbot
```

### 2) Configure runtime env

Create `.env.production` from `.env.example` and set production values.

### 3) Build and run

```bash
docker compose up -d --build
```

### 4) Nginx reverse proxy

- Provided: `nginx.conf`
- Includes reverse proxy, gzip + brotli, static cache headers.

### 5) HTTPS with Let’s Encrypt (Certbot)

If Nginx runs on host machine:
```bash
sudo certbot certonly --nginx -d yourdomain.com -d www.yourdomain.com
```

If using Dockerized Nginx, common pattern:
1. Temporarily expose port 80 and use webroot challenge.
2. Mount `/etc/letsencrypt` into Nginx container.
3. Add SSL server block + certificate paths in `nginx.conf`.
4. Reload Nginx after cert issuance.

### 6) Mainland compliance note

If hosting on servers located in Mainland China, ICP filing is typically required.
If hosting outside Mainland China, ICP may not be required, but access speed and reachability can vary.

## Deployment B: Vercel (Global)

> Warning: Reachability from Mainland China can be slow or unavailable depending on network conditions.

1. Push repository to GitHub.
2. Import project in Vercel.
3. Set env vars from `.env.example` in Vercel Project Settings.
4. Deploy and bind custom domain.
5. Recommended for better cross-region experience: offload static assets using `ASSET_BASE_URL` + CDN.

## CI

GitHub Actions workflow: `.github/workflows/ci.yml`

Pipeline:
- Node 20
- `corepack enable`
- `pnpm install --frozen-lockfile`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
