import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IEmail {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private emails: IEmail[] = [];

  public async sendMail(to: string, body: string): Promise<void> {
    this.emails.push({ to, body });
  }
}
