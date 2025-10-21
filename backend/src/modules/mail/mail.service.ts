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
      from: 'no-reply@object-set-visualizer.com',
      ...options,
    });
  }

  async sendPasswordRecovery(to: string, token: string) {
    const appName = 'Object Visual Studio';
    const aboutUrl = `${process.env.APP_URL}/about`;
    const link = `${process.env.APP_URL}/reset-password?token=${token}`;
    const baseStyle = `font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; margin:0; padding:0;`;
    const cardStyle = `background: #fff; max-width: 420px; margin: 32px auto; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 32px 24px; text-align: center;`;
    const titleStyle = `font-size: 1.3rem; color: #2563eb; font-weight: bold; margin-bottom: 12px;`;
    const btnStyle = `display:inline-block; margin: 24px auto 0 auto; padding: 12px 32px; background: #22c55e; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 1rem; letter-spacing: 0.5px; box-shadow: 0 1px 4px #0002; transition: background 0.2s;`;
    const infoStyle = `color: #555; font-size: 1rem; margin-bottom: 18px;`;
    const footerStyle = `margin-top: 32px; color: #888; font-size: 0.9rem;`;
    const appStyle = `font-size: 1.1rem; color: #222; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;`;
    const aboutStyle = `display:inline-block; margin-top: 8px; color: #2563eb; font-size: 0.98rem; text-decoration: underline;`;

    const html = `
      <body style="${baseStyle}">
        <div style="${cardStyle}">
          <div style="${appStyle}">${appName}</div>
          <div style="${titleStyle}">Recuperação de Senha</div>
          <div style="${infoStyle}">Para redefinir sua senha, clique no botão abaixo:</div>
          <a href="${link}" style="${btnStyle}">Redefinir Senha</a>
          <a href="${aboutUrl}" style="${aboutStyle}">Sobre o ${appName}</a>
          <div style="${footerStyle}">Se você não solicitou a recuperação, ignore este e-mail.</div>
        </div>
      </body>
    `;
    return this.sendMail({
      to,
      subject: 'Recuperação de senha',
      html
    });
  }

  async sendProjectInvite(to: string, projectTitle: string, isRegistered: boolean, inviteLink: string) {
    let html: string;
    const appName = 'Object Set Visualizer';
    const aboutUrl = `${process.env.APP_URL}/about`;
    const baseStyle = `font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; margin:0; padding:0;`;
    const cardStyle = `background: #fff; max-width: 420px; margin: 32px auto; border-radius: 10px; box-shadow: 0 2px 8px #0001; padding: 32px 24px; text-align: center;`;
    const titleStyle = `font-size: 1.3rem; color: #2563eb; font-weight: bold; margin-bottom: 12px;`;
    const btnStyle = `display:inline-block; margin: 24px auto 0 auto; padding: 12px 32px; background: #22c55e; color: #fff; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 1rem; letter-spacing: 0.5px; box-shadow: 0 1px 4px #0002; transition: background 0.2s;`;
    const infoStyle = `color: #555; font-size: 1rem; margin-bottom: 18px;`;
    const footerStyle = `margin-top: 32px; color: #888; font-size: 0.9rem;`;
    const appStyle = `font-size: 1.1rem; color: #222; font-weight: 600; margin-bottom: 8px; letter-spacing: 0.5px;`;
    const aboutStyle = `display:inline-block; margin-top: 8px; color: #2563eb; font-size: 0.98rem; text-decoration: underline;`;

    if (isRegistered) {
      html = `
        <body style="${baseStyle}">
          <div style="${cardStyle}">
            <div style="${appStyle}">${appName}</div>
            <div style="${titleStyle}">Convite para Projeto</div>
            <div style="${infoStyle}">Você foi adicionado ao projeto <b>${projectTitle}</b>.</div>
            <a href="${inviteLink}" style="${btnStyle}">Acessar Projeto</a>
            <a href="${aboutUrl}" style="${aboutStyle}">Sobre o ${appName}</a>
            <div style="${footerStyle}">Se você não reconhece este convite, ignore este e-mail.</div>
          </div>
        </body>
      `;
    } else {
      html = `
        <body style="${baseStyle}">
          <div style="${cardStyle}">
            <div style="${appStyle}">${appName}</div>
            <div style="${titleStyle}">Convite para Projeto</div>
            <div style="${infoStyle}">Você foi convidado para o projeto <b>${projectTitle}</b>.<br>Seu e-mail já está cadastrado, mas é necessário finalizar o cadastro para acessar o projeto.</div>
            <a href="${inviteLink}" style="${btnStyle}">Finalizar Cadastro</a>
            <a href="${aboutUrl}" style="${aboutStyle}">Sobre o ${appName}</a>
            <div style="${footerStyle}">Se você não reconhece este convite, ignore este e-mail.</div>
          </div>
        </body>
      `;
    }
    return this.sendMail({
      to,
      subject: 'Convite para projeto',
      html,
    });
  }
}
