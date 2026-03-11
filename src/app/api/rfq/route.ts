import {randomUUID} from 'node:crypto';
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {NextRequest, NextResponse} from 'next/server';
import {env} from '@/lib/env';
import {verifyTencentCaptcha} from '@/lib/leads/captcha';
import {persistLeadAndNotify} from '@/lib/leads/service';
import {checkRateLimit} from '@/lib/leads/rate-limit';
import type {LeadAttachment} from '@/lib/leads/types';

const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_TEXT_LENGTH = 300;
const ALLOWED_LOCALES = new Set(['zh', 'en']);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.zip', '.rar', '.png', '.jpg', '.jpeg']);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || '0.0.0.0';
  }

  return req.headers.get('x-real-ip')?.trim() || '0.0.0.0';
}

function readText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function sanitizeFileName(name: string) {
  const normalized = name.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-');
  return normalized.length > 80 ? normalized.slice(0, 80) : normalized;
}

function validateRequired(name: string, value: string, maxLength = MAX_TEXT_LENGTH) {
  if (!value) return `${name} is required`;
  if (value.length > maxLength) return `${name} is too long`;
  return '';
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function saveAttachment(file: File): Promise<LeadAttachment> {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    throw new Error('attachment_too_large');
  }

  const originalName = file.name || 'attachment.bin';
  const ext = path.extname(originalName).toLowerCase();

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new Error('attachment_type_not_allowed');
  }

  const uploadDir = path.resolve(process.cwd(), 'data/uploads');
  await mkdir(uploadDir, {recursive: true});

  const baseName = sanitizeFileName(path.basename(originalName, ext)) || 'attachment';
  const fileName = `${Date.now()}-${randomUUID()}-${baseName}${ext}`;
  const absolutePath = path.join(uploadDir, fileName);

  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, bytes);

  return {
    originalName,
    savedPath: path.relative(process.cwd(), absolutePath).replaceAll('\\', '/'),
    mimeType: file.type || 'application/octet-stream',
    size: file.size
  };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rate = checkRateLimit(`rfq:${ip}`, 8, 10 * 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        {ok: false, message: 'rate_limited'},
        {
          status: 429,
          headers: {'Retry-After': String(rate.retryAfterSeconds)}
        }
      );
    }

    const formData = await req.formData();
    const honeypot = readText(formData, 'website');
    if (honeypot) {
      return NextResponse.json({ok: true});
    }

    if (env.EMAIL_PROVIDER !== 'smtp') {
      return NextResponse.json({ok: false, message: 'email_not_configured'}, {status: 503});
    }

    const localeRaw = readText(formData, 'locale');
    const locale = ALLOWED_LOCALES.has(localeRaw) ? (localeRaw as 'zh' | 'en') : 'en';

    const name = readText(formData, 'name');
    const company = readText(formData, 'company');
    const email = readText(formData, 'email');
    const whatsappWechat = readText(formData, 'whatsappWechat');
    const productType = readText(formData, 'productType');
    const targetQuantity = readText(formData, 'targetQuantity');
    const targetPrice = readText(formData, 'targetPrice');
    const targetDeliveryDate = readText(formData, 'targetDeliveryDate');
    const message = readText(formData, 'message');
    const sourcePage = readText(formData, 'sourcePage') || `/${locale}/contact`;
    const captchaTicket = readText(formData, 'captchaTicket');
    const captchaRandstr = readText(formData, 'captchaRandstr');

    const validationErrors = [
      validateRequired('name', name),
      validateRequired('company', company),
      validateRequired('email', email),
      validateRequired('whatsappWechat', whatsappWechat),
      validateRequired('productType', productType),
      validateRequired('targetQuantity', targetQuantity),
      validateRequired('targetDeliveryDate', targetDeliveryDate),
      validateRequired('message', message, MAX_MESSAGE_LENGTH)
    ].filter(Boolean);

    if (!validateEmail(email)) {
      validationErrors.push('email is invalid');
    }

    if (Number.isNaN(Date.parse(targetDeliveryDate))) {
      validationErrors.push('targetDeliveryDate is invalid');
    }

    if (targetPrice.length > MAX_TEXT_LENGTH) {
      validationErrors.push('targetPrice is too long');
    }

    if (validationErrors.length > 0) {
      return NextResponse.json({ok: false, message: 'invalid_payload', errors: validationErrors}, {status: 400});
    }

    const captcha = await verifyTencentCaptcha({
      ticket: captchaTicket,
      randstr: captchaRandstr,
      userIp: ip
    });

    if (!captcha.ok) {
      return NextResponse.json({ok: false, message: captcha.reason || 'captcha_failed'}, {status: 400});
    }

    let attachment: LeadAttachment | undefined;
    const techPack = formData.get('techPack');

    if (techPack instanceof File && techPack.size > 0) {
      attachment = await saveAttachment(techPack);
    }

    const {lead, failedChannels} = await persistLeadAndNotify({
      name,
      company,
      email,
      whatsappWechat,
      productType,
      targetQuantity,
      targetPrice: targetPrice || undefined,
      targetDeliveryDate,
      message,
      locale,
      sourcePage,
      ip,
      userAgent: req.headers.get('user-agent') || undefined,
      captchaTicket: captchaTicket || undefined,
      captchaRandstr: captchaRandstr || undefined,
      attachment
    });

    if (failedChannels.includes('smtp')) {
      return NextResponse.json({ok: false, message: 'smtp_send_failed'}, {status: 502});
    }

    return NextResponse.json({ok: true, leadId: lead.id, failedChannels});
  } catch (error) {
    console.error('RFQ API error:', error);
    return NextResponse.json({ok: false, message: 'internal_error'}, {status: 500});
  }
}
