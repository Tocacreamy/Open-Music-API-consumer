import nodemailer from "nodemailer";

export class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  sendMail(targetEmail, content) {
    const message = {
      from: "OpenMusic App ",
      to: targetEmail,
      subject: "OpenMusic - export lagu ",
      text: "Terlampir hasil export lagu Anda",
        attachments: [
        {
          filename: "exported_songs.json",
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}
