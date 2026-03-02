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
