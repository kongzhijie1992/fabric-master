export type LeadAttachment = {
  originalName: string;
  savedPath: string;
  mimeType: string;
  size: number;
};

export type LeadInput = {
  name: string;
  company: string;
  email: string;
  whatsappWechat: string;
  productType: string;
  targetQuantity: string;
  targetPrice?: string;
  targetDeliveryDate: string;
  message: string;
  locale: 'zh' | 'en';
  sourcePage: string;
  ip: string;
  userAgent?: string;
  captchaTicket?: string;
  captchaRandstr?: string;
  attachment?: LeadAttachment;
};

export type LeadRecord = LeadInput & {
  id: string;
  createdAt: string;
};

export type LeadStore = {
  append: (lead: LeadRecord) => Promise<void>;
};

export type LeadNotifier = {
  channel: string;
  notify: (lead: LeadRecord) => Promise<void>;
};

export const VALIDATION_LIMITS = {
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
  MAX_MESSAGE_LENGTH: 5000,
  MAX_TEXT_LENGTH: 300,
  RATE_LIMIT_WINDOW: 10 * 60 * 1000, // 10 minutes
  RATE_LIMIT_MAX_REQUESTS: 8
} as const;

export const ALLOWED_LOCALES = new Set(['zh', 'en'] as const);

export const ALLOWED_FILE_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.zip', '.rar', '.png', '.jpg', '.jpeg'] as const);

export const ALLOWED_MIME_TYPES = new Set(
  [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
    'application/x-rar-compressed',
    'image/png',
    'image/jpeg',
    'image/jpg'
  ] as const
);
