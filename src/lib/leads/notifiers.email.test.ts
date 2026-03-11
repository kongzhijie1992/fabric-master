import assert from 'node:assert/strict';
import test from 'node:test';
import {EmailNotifier} from './notifiers';
import type {LeadRecord} from './types';

test('EmailNotifier sends expected email payload', async () => {
  const sent: Array<{from?: string; to: string; subject: string; text: string}> = [];

  const mockTransport = {
    async sendMail(payload: {from?: string; to: string; subject: string; text: string}) {
      sent.push(payload);
      return {messageId: 'mock-message-id'};
    }
  };

  const lead: LeadRecord = {
    id: 'lead-1',
    createdAt: '2026-03-11T10:00:00.000Z',
    locale: 'zh',
    sourcePage: '/zh/contact',
    ip: '127.0.0.1',
    userAgent: 'node-test',
    name: 'Alice',
    company: 'Timeless Clothing',
    email: 'alice@example.com',
    whatsappWechat: 'alice-wechat',
    productType: 'Hoodie',
    targetQuantity: '1000',
    targetPrice: '5.5',
    targetDeliveryDate: '2026-06-01',
    message: 'Please quote for bulk order.'
  };

  const notifier = new EmailNotifier(mockTransport, {
    from: 'factory@example.com',
    to: 'publicrelations@timelessclothinggroup.com.cn'
  });

  await notifier.notify(lead);

  assert.equal(sent.length, 1);
  assert.equal(sent[0]?.from, 'factory@example.com');
  assert.equal(sent[0]?.to, 'publicrelations@timelessclothinggroup.com.cn');
  assert.equal(sent[0]?.subject, '[RFQ] Timeless Clothing - Hoodie');
  assert.match(sent[0]?.text || '', /Name: Alice/);
  assert.match(sent[0]?.text || '', /Company: Timeless Clothing/);
  assert.match(sent[0]?.text || '', /Target Quantity: 1000/);
});
