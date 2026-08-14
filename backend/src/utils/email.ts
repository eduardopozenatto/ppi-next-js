import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendResetCodeEmail(to: string, code: string): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[SMTP] Envio de e-mail ignorado: SMTP_USER ou SMTP_PASS não configurado.');
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"LabControl" <noreply@labcontrol.app>',
    to,
    subject: 'LabControl — Código de recuperação de senha',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e;">Recuperação de Senha</h2>
        <p>Você solicitou a alteração de senha no LabControl.</p>
        <p>Seu código de verificação é:</p>
        <div style="background: #f0f0f5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${code}</span>
        </div>
        <p style="color: #666; font-size: 14px;">Este código expira em <strong>15 minutos</strong>.</p>
        <p style="color: #666; font-size: 14px;">Se você não solicitou esta alteração, ignore este email.</p>
      </div>
    `,
  });
}

export async function sendNewAccountEmail(to: string, name: string, tempPassword: string): Promise<void> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('[SMTP] Envio de e-mail de boas-vindas ignorado: SMTP_USER ou SMTP_PASS não configurado.');
    return;
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || '"LabControl" <noreply@labcontrol.app>',
    to,
    subject: 'LabControl — Bem-vindo! Suas credenciais de acesso',
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
        <h2 style="color: #1a1a2e;">Bem-vindo ao LabControl, ${name}!</h2>
        <p>Sua conta foi criada no sistema de gestão de laboratórios.</p>
        <p>Sua senha provisória de primeiro acesso é:</p>
        <div style="background: #f0f0f5; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">${tempPassword}</span>
        </div>
        <p style="color: #666; font-size: 14px;">No seu primeiro login, você precisará cadastrar sua nova senha pessoal.</p>
      </div>
    `,
  });
}
