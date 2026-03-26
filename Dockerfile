# Builder stage - optimized for Alibaba Cloud
# Using Alibaba Cloud container registry for faster pulls in China
FROM registry.cn-hangzhou.aliyuncs.com/acs/node:20-alpine AS builder
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copy package files first for better Docker layer caching
# This ensures dependencies are cached unless package files change
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source code after dependencies to maximize cache efficiency
COPY . .

# Build arguments for environment variables
# These can be overridden at build time for different environments
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_RFQ_ENDPOINT=
ARG NEXT_PUBLIC_RFQ_EMAIL=publicrelations@timelessclothinggroup.com.cn
ARG ASSET_BASE_URL=
ARG NEXT_PUBLIC_ASSET_BASE_URL=
ARG BAIDU_TONGJI_ID=
ARG NEXT_PUBLIC_BAIDU_TONGJI_ID=
ARG TENCENT_CAPTCHA_APP_ID=
ARG NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID=

# Set environment variables from build arguments
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_RFQ_ENDPOINT=$NEXT_PUBLIC_RFQ_ENDPOINT
ENV NEXT_PUBLIC_RFQ_EMAIL=$NEXT_PUBLIC_RFQ_EMAIL
ENV ASSET_BASE_URL=$ASSET_BASE_URL
ENV NEXT_PUBLIC_ASSET_BASE_URL=$NEXT_PUBLIC_ASSET_BASE_URL
ENV BAIDU_TONGJI_ID=$BAIDU_TONGJI_ID
ENV NEXT_PUBLIC_BAIDU_TONGJI_ID=$NEXT_PUBLIC_BAIDU_TONGJI_ID
ENV TENCENT_CAPTCHA_APP_ID=$TENCENT_CAPTCHA_APP_ID
ENV NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID=$NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID

# Build the application
# This generates static assets in the /out directory
RUN pnpm build

# Production stage - minimal nginx image with Alibaba Cloud mirror
# Using Alibaba Cloud nginx image for optimal performance in China
FROM registry.cn-hangzhou.aliyuncs.com/acs/nginx:1.27-alpine AS runner

# Copy custom nginx configuration
# Configured for serving Next.js static exports
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/out /usr/share/nginx/html

# Add health check for container orchestration
# Checks every 30s, times out after 3s, allows 5s startup period, retries 3 times
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/api/health || exit 1

# Expose port 80
EXPOSE 80

# Start nginx in foreground mode (required for Docker)
CMD ["nginx", "-g", "daemon off;"]
