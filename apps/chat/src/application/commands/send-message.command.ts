interface Props {
  content: string;
  senderId: string;
  receiverId: string;
}

export class SendMessageCommand {
  public constructor(public readonly props: Props) {}
}
