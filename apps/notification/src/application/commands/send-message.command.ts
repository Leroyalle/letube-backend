interface Props {
  to: string[];
  subject: string;
  message: string;
  type: 'AUTH' | 'NOTIFICATION';
}

export class SendMessageCommand {
  public constructor(public readonly props: Props) {}
}
