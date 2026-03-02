import path from 'node:path';
import {env} from '@/lib/env';
import {createEnabledNotifiers} from '@/lib/leads/notifiers';
import {FileLeadStore} from '@/lib/leads/store';
import type {LeadInput, LeadRecord} from '@/lib/leads/types';

function buildLeadId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const leadStore = new FileLeadStore(path.resolve(process.cwd(), env.LEADS_STORE));

export async function persistLeadAndNotify(input: LeadInput) {
  const lead: LeadRecord = {
    ...input,
    id: buildLeadId(),
    createdAt: new Date().toISOString()
  };

  await leadStore.append(lead);

  const notifiers = createEnabledNotifiers();
  const results = await Promise.allSettled(notifiers.map((notifier) => notifier.notify(lead)));

  const failedChannels = results
    .map((result, index) => ({result, channel: notifiers[index]?.channel || 'unknown'}))
    .filter((entry): entry is {result: PromiseRejectedResult; channel: string} => entry.result.status === 'rejected')
    .map((entry) => entry.channel);

  return {
    lead,
    failedChannels
  };
}
