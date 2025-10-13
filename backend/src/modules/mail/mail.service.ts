import type { SendMailOptions } from './mail.types.ts';
import nodemailer from 'nodemailer';

export class MailService {
  private transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(options: SendMailOptions) {
    return this.transporter.sendMail({
      from: process.env.MAIL_FROM || 'no-reply@projeto.com',
      ...options,
    });
  }

  async sendPasswordRecovery(to: string, token: string) {
    const link = `${process.env.APP_URL}/reset-password?token=${token}`;
    return this.sendMail({
      to,
      subject: 'Recuperação de senha',
      html: `<p>Para redefinir sua senha, clique no link: <a href="${link}">${link}</a></p>`
    });
  }

  async sendProjectInvite(to: string, projectTitle: string, isRegistered: boolean, inviteLink: string) {
    const html = isRegistered
      ? `<p>Você foi adicionado ao projeto <b>${projectTitle}</b>. Acesse sua conta para visualizar.</p>`
      : `<p>Você foi convidado para o projeto <b>${projectTitle}</b>. Crie sua conta usando este link: <a href="${inviteLink}">${inviteLink}</a></p>`;
    return this.sendMail({
      to,
      subject: 'Convite para projeto',
      html,
    });
  }
}
