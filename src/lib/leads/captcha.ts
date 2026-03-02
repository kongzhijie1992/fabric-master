import {env} from '@/lib/env';

export type CaptchaVerificationResult = {
  ok: boolean;
  reason?: string;
};

export async function verifyTencentCaptcha(params: {
  ticket?: string;
  randstr?: string;
  userIp: string;
}): Promise<CaptchaVerificationResult> {
  if (!env.TENCENT_CAPTCHA_APP_ID || !env.TENCENT_CAPTCHA_APP_SECRET) {
    return {ok: true};
  }

  if (!params.ticket || !params.randstr) {
    return {ok: false, reason: 'captcha_required'};
  }

  const search = new URLSearchParams({
    aid: env.TENCENT_CAPTCHA_APP_ID,
    AppSecretKey: env.TENCENT_CAPTCHA_APP_SECRET,
    Ticket: params.ticket,
    Randstr: params.randstr,
    UserIP: params.userIp
  });

  const verifyUrl = `https://ssl.captcha.qq.com/ticket/verify?${search.toString()}`;

  const response = await fetch(verifyUrl, {
    method: 'GET',
    cache: 'no-store'
  });

  if (!response.ok) {
    return {ok: false, reason: 'captcha_verify_failed'};
  }

  const payload = (await response.json()) as {response?: string; err_msg?: string};

  if (payload.response === '1') {
    return {ok: true};
  }

  return {ok: false, reason: payload.err_msg || 'captcha_verify_failed'};
}
