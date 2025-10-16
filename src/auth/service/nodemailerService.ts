import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings';
import { injectable } from 'inversify';

@injectable()
export class NodemailerService {
  async sendEmail(
    email: string,
    code: string,
    template: (code: string) => string,
  ): Promise<boolean> {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: SETTINGS.EMAIL,
        pass: SETTINGS.PASS,
      },
    });

    let info = await transporter.sendMail({
      from: 'me <irinasuperdev>',
      to: email,
      subject: 'Your code is here',
      html: template(code),
    });

    return !!info;
  }
}
