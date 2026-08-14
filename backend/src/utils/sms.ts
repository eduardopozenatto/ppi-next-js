import { env } from '../config/env';

/**
 * Envia um código de verificação por SMS.
 * Se as credenciais do Twilio estiverem no env, realiza a requisição real.
 * Caso contrário, apenas faz log do código no console para desenvolvimento.
 */
export async function sendSmsCode(phone: string, code: string): Promise<void> {
  const accountSid = env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID;
  const authToken = env.TWILIO_AUTH_TOKEN || process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.log(`[SMS] MODO DEV / CREDENCIAIS NÃO CONFIGURADAS — Código SMS para ${phone}: ${code}`);
    return;
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({
      To: phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`,
      From: fromNumber,
      Body: `LabControl — Seu código de verificação é: ${code}. Válido por 15 minutos.`,
    });

    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('[SMS Twilio Error]', res.status, errText);
    } else {
      console.log(`[SMS Twilio Enviado] Código enviado com sucesso para ${phone}`);
    }
  } catch (err) {
    console.error('[SMS Twilio Exception]', err);
  }
}
