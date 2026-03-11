import nodemailer from 'nodemailer';
import {env} from '../env';
import type {LeadNotifier, LeadRecord} from './types';

function formatLeadText(lead: LeadRecord) {
  return [
    `Lead ID: ${lead.id}`,
    `Created At: ${lead.createdAt}`,
    `Locale: ${lead.locale}`,
    `Name: ${lead.name}`,
    `Company: ${lead.company}`,
    `Email: ${lead.email}`,
    `WhatsApp/WeChat: ${lead.whatsappWechat}`,
    `Product Type: ${lead.productType}`,
    `Target Quantity: ${lead.targetQuantity}`,
    `Target Price: ${lead.targetPrice || '-'}`,
    `Target Delivery Date: ${lead.targetDeliveryDate}`,
    `Message: ${lead.message}`,
    `Attachment: ${lead.attachment ? `${lead.attachment.originalName} (${lead.attachment.size} bytes)` : '-'}`,
    `IP: ${lead.ip}`,
    `User Agent: ${lead.userAgent || '-'}`
  ].join('\n');
}

export class FeishuNotifier implements LeadNotifier {
  readonly channel = 'feishu';

  constructor(private readonly webhookUrl: string) {}

  async notify(lead: LeadRecord) {
    const body = {
      msg_type: 'text',
      content: {
        text: `New RFQ\n${formatLeadText(lead)}`
      }
    };

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Feishu webhook failed: ${response.status}`);
    }
  }
}

export class WeComNotifier implements LeadNotifier {
  readonly channel = 'wecom';

  constructor(private readonly webhookUrl: string) {}

  async notify(lead: LeadRecord) {
    const body = {
      msgtype: 'text',
      text: {
        content: `New RFQ\n${formatLeadText(lead)}`
      }
    };

    const response = await fetch(this.webhookUrl, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`WeCom webhook failed: ${response.status}`);
    }
  }
}

export class EmailNotifier implements LeadNotifier {
  readonly channel = 'smtp';

  constructor(
    private readonly transport: Pick<nodemailer.Transporter, 'sendMail'> = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
      }
    }),
    private readonly mailConfig: {from?: string; to: string} = {
      from: env.SMTP_FROM,
      to: env.NEXT_PUBLIC_RFQ_EMAIL
    }
  ) {}

  async notify(lead: LeadRecord) {
    await this.transport.sendMail({
      from: this.mailConfig.from,
      to: this.mailConfig.to,
      subject: `[RFQ] ${lead.company} - ${lead.productType}`,
      text: formatLeadText(lead)
    });
  }
}

export function createEnabledNotifiers() {
  const notifiers: LeadNotifier[] = [];

  if (env.FEISHU_WEBHOOK_URL) {
    notifiers.push(new FeishuNotifier(env.FEISHU_WEBHOOK_URL));
  }

  if (env.WECOM_WEBHOOK_URL) {
    notifiers.push(new WeComNotifier(env.WECOM_WEBHOOK_URL));
  }

  if (env.EMAIL_PROVIDER === 'smtp') {
    notifiers.push(new EmailNotifier());
  }

  return notifiers;
}
