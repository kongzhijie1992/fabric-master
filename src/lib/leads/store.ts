import {mkdir, open, readFile, rename, rm, writeFile} from 'node:fs/promises';
import path from 'node:path';
import type {LeadRecord, LeadStore} from '@/lib/leads/types';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class FileLeadStore implements LeadStore {
  constructor(private readonly filePath: string) {}

  private async ensureFile() {
    const dir = path.dirname(this.filePath);
    await mkdir(dir, {recursive: true});

    try {
      await readFile(this.filePath, 'utf8');
    } catch {
      await writeFile(this.filePath, '[]\n', 'utf8');
    }
  }

  private async withLock<T>(callback: () => Promise<T>) {
    const lockPath = `${this.filePath}.lock`;
    const timeoutMs = 5000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      try {
        const lockHandle = await open(lockPath, 'wx');

        try {
          return await callback();
        } finally {
          await lockHandle.close();
          await rm(lockPath, {force: true});
        }
      } catch (error) {
        const code = (error as NodeJS.ErrnoException).code;

        if (code !== 'EEXIST') {
          throw error;
        }

        await sleep(80);
      }
    }

    throw new Error('Failed to acquire lead store lock within timeout.');
  }

  async append(lead: LeadRecord) {
    await this.ensureFile();

    await this.withLock(async () => {
      const raw = await readFile(this.filePath, 'utf8');
      let parsed: LeadRecord[] = [];

      try {
        const json = JSON.parse(raw);
        if (Array.isArray(json)) {
          parsed = json as LeadRecord[];
        }
      } catch {
        parsed = [];
      }

      parsed.push(lead);

      const tempPath = `${this.filePath}.tmp-${process.pid}-${Date.now()}`;
      await writeFile(tempPath, `${JSON.stringify(parsed, null, 2)}\n`, 'utf8');
      await rename(tempPath, this.filePath);
    });
  }
}
