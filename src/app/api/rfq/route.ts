import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {NextResponse} from 'next/server';
import {checkRateLimit} from '@/lib/leads/rate-limit';
import {verifyTencentCaptcha} from '@/lib/leads/captcha';
import {persistLeadAndNotify} from '@/lib/leads/service';
import type {LeadAttachment, LeadInput} from '@/lib/leads/types';
import {env} from '@/lib/env';

export const runtime = 'nodejs';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const allowedExtensions = new Set(['.pdf', '.doc', '.docx', '.zip', '.rar', '.png', '.jpg', '.jpeg']);

function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  return request.headers.get('x-real-ip') || 'unknown';
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function saveAttachment(file: File): Promise<LeadAttachment> {
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error('Attachment exceeds max size 10MB.');
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    throw new Error('Unsupported attachment format.');
  }

  const leadPath = path.resolve(process.cwd(), env.LEADS_STORE);
  const uploadDir = path.join(path.dirname(leadPath), 'uploads');
  await mkdir(uploadDir, {recursive: true});

  const safeName = sanitizeFileName(path.basename(file.name));
  const storedName = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${safeName}`;
  const absolutePath = path.join(uploadDir, storedName);

  const bytes = await file.arrayBuffer();
  await writeFile(absolutePath, Buffer.from(bytes));

  return {
    originalName: file.name,
    savedPath: absolutePath,
    mimeType: file.type || 'application/octet-stream',
    size: file.size
  };
}

function validationError(message: string, status = 400) {
  return NextResponse.json({ok: false, message}, {status});
}

export async function POST(request: Request) {
  const ip = getClientIp(request);

  const limit = checkRateLimit(`rfq:${ip}`, 6, 10 * 60 * 1000);
  if (!limit.allowed) {
    return validationError('Too many requests. Please try again later.', 429);
  }

  const formData = await request.formData();

  const honeypot = getText(formData, 'website');
  if (honeypot) {
    return NextResponse.json({ok: true});
  }

  const localeRaw = getText(formData, 'locale');
  const locale = localeRaw === 'en' ? 'en' : 'zh';

  const captchaTicket = getText(formData, 'captchaTicket');
  const captchaRandstr = getText(formData, 'captchaRandstr');
  const captchaResult = await verifyTencentCaptcha({
    ticket: captchaTicket || undefined,
    randstr: captchaRandstr || undefined,
    userIp: ip
  });

  if (!captchaResult.ok) {
    return validationError(locale === 'zh' ? '请先完成人机验证。' : 'Please complete captcha verification.');
  }

  const leadInput: Omit<LeadInput, 'ip' | 'userAgent'> = {
    name: getText(formData, 'name'),
    company: getText(formData, 'company'),
    email: getText(formData, 'email'),
    whatsappWechat: getText(formData, 'whatsappWechat'),
    productType: getText(formData, 'productType'),
    targetQuantity: getText(formData, 'targetQuantity'),
    targetPrice: getText(formData, 'targetPrice') || undefined,
    targetDeliveryDate: getText(formData, 'targetDeliveryDate'),
    message: getText(formData, 'message'),
    locale,
    sourcePage: getText(formData, 'sourcePage') || `/${locale}/contact`,
    captchaTicket: captchaTicket || undefined,
    captchaRandstr: captchaRandstr || undefined
  };

  const requiredKeys: Array<keyof typeof leadInput> = [
    'name',
    'company',
    'email',
    'whatsappWechat',
    'productType',
    'targetQuantity',
    'targetDeliveryDate',
    'message'
  ];

  for (const key of requiredKeys) {
    if (!leadInput[key]) {
      return validationError(locale === 'zh' ? '请填写所有必填字段。' : 'Please complete all required fields.');
    }
  }

  if (!validateEmail(leadInput.email)) {
    return validationError(locale === 'zh' ? '邮箱格式不正确。' : 'Invalid email format.');
  }

  const deliveryDate = new Date(leadInput.targetDeliveryDate);
  if (Number.isNaN(deliveryDate.getTime())) {
    return validationError(locale === 'zh' ? '目标交期格式不正确。' : 'Invalid target delivery date.');
  }

  if (leadInput.message.length > 5000) {
    return validationError(locale === 'zh' ? '需求说明过长。' : 'Message is too long.');
  }

  const fileEntry = formData.get('techPack');
  let attachment: LeadAttachment | undefined;

  if (fileEntry instanceof File && fileEntry.size > 0) {
    try {
      attachment = await saveAttachment(fileEntry);
    } catch (error) {
      return validationError((error as Error).message);
    }
  }

  const {lead, failedChannels} = await persistLeadAndNotify({
    ...leadInput,
    attachment,
    ip,
    userAgent: request.headers.get('user-agent') || undefined
  });

  return NextResponse.json({
    ok: true,
    leadId: lead.id,
    failedChannels
  });
}
