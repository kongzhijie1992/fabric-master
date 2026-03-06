export type EmailProvider = 'none' | 'smtp';

type Env = {
  NEXT_PUBLIC_SITE_URL: string;
  NEXT_PUBLIC_RFQ_ENDPOINT?: string;
  NEXT_PUBLIC_RFQ_EMAIL: string;
  ASSET_BASE_URL?: string;
  BAIDU_TONGJI_ID?: string;
  TENCENT_CAPTCHA_APP_ID?: string;
  EMAIL_PROVIDER: EmailProvider;
  LEADS_STORE: string;
  SMTP_HOST?: string;
  SMTP_PORT?: number;
  SMTP_USER?: string;
  SMTP_PASS?: string;
  SMTP_FROM?: string;
  FEISHU_WEBHOOK_URL?: string;
  WECOM_WEBHOOK_URL?: string;
  TENCENT_CAPTCHA_APP_SECRET?: string;
};

function readString(name: string, fallback?: string) {
  const value = process.env[name]?.trim();

  if (value && value.length > 0) {
    return value;
  }

  if (fallback !== undefined) {
    return fallback;
  }

  return undefined;
}

function normalizeBaseUrl(url?: string) {
  if (!url) return undefined;
  return url.replace(/\/+$/, '');
}

function parsePort(name: string, raw?: string) {
  if (!raw) return undefined;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < 1 || value > 65535) {
    throw new Error(`Environment variable ${name} must be a valid port number.`);
  }
  return value;
}

function validateUrl(name: string, value: string) {
  try {
    const parsed = new URL(value);
    if (!parsed.protocol.startsWith('http')) {
      throw new Error();
    }
  } catch {
    throw new Error(`Environment variable ${name} must be a valid http/https URL.`);
  }
}

function loadEnv(): Env {
  const errors: string[] = [];

  const NEXT_PUBLIC_SITE_URL = readString('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000')!;
  const NEXT_PUBLIC_RFQ_ENDPOINT = readString('NEXT_PUBLIC_RFQ_ENDPOINT');
  const NEXT_PUBLIC_RFQ_EMAIL = readString('NEXT_PUBLIC_RFQ_EMAIL', 'sales@example.com')!;
  const ASSET_BASE_URL = normalizeBaseUrl(readString('ASSET_BASE_URL') || readString('NEXT_PUBLIC_ASSET_BASE_URL'));

  const providerRaw = readString('EMAIL_PROVIDER', 'none')!;
  const EMAIL_PROVIDER = providerRaw === 'smtp' ? 'smtp' : providerRaw === 'none' ? 'none' : undefined;

  if (!EMAIL_PROVIDER) {
    errors.push('EMAIL_PROVIDER must be either "none" or "smtp".');
  }

  if (ASSET_BASE_URL) {
    try {
      validateUrl('ASSET_BASE_URL', ASSET_BASE_URL);
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  try {
    validateUrl('NEXT_PUBLIC_SITE_URL', NEXT_PUBLIC_SITE_URL);
  } catch (error) {
    errors.push((error as Error).message);
  }

  if (NEXT_PUBLIC_RFQ_ENDPOINT) {
    try {
      validateUrl('NEXT_PUBLIC_RFQ_ENDPOINT', NEXT_PUBLIC_RFQ_ENDPOINT);
    } catch (error) {
      errors.push((error as Error).message);
    }
  }

  const SMTP_HOST = readString('SMTP_HOST');
  const SMTP_PORT = readString('SMTP_PORT');
  const SMTP_USER = readString('SMTP_USER');
  const SMTP_PASS = readString('SMTP_PASS');
  const SMTP_FROM = readString('SMTP_FROM');

  const TENCENT_CAPTCHA_APP_ID =
    readString('NEXT_PUBLIC_TENCENT_CAPTCHA_APP_ID') || readString('TENCENT_CAPTCHA_APP_ID');
  const TENCENT_CAPTCHA_APP_SECRET = readString('TENCENT_CAPTCHA_APP_SECRET');

  if (TENCENT_CAPTCHA_APP_SECRET && !TENCENT_CAPTCHA_APP_ID) {
    errors.push('TENCENT_CAPTCHA_APP_ID is required when TENCENT_CAPTCHA_APP_SECRET is set.');
  }

  if (errors.length > 0) {
    throw new Error(`Invalid environment configuration:\n- ${errors.join('\n- ')}`);
  }

  return {
    NEXT_PUBLIC_SITE_URL,
    NEXT_PUBLIC_RFQ_ENDPOINT,
    NEXT_PUBLIC_RFQ_EMAIL,
    ASSET_BASE_URL,
    BAIDU_TONGJI_ID: readString('NEXT_PUBLIC_BAIDU_TONGJI_ID') || readString('BAIDU_TONGJI_ID'),
    TENCENT_CAPTCHA_APP_ID,
    EMAIL_PROVIDER: EMAIL_PROVIDER!,
    LEADS_STORE: readString('LEADS_STORE', './data/leads.json')!,
    SMTP_HOST,
    SMTP_PORT: parsePort('SMTP_PORT', SMTP_PORT),
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
    FEISHU_WEBHOOK_URL: readString('FEISHU_WEBHOOK_URL'),
    WECOM_WEBHOOK_URL: readString('WECOM_WEBHOOK_URL'),
    TENCENT_CAPTCHA_APP_SECRET
  };
}

export const env = loadEnv();

export type AppEnv = typeof env;
