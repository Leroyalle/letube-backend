interface Props {
  senderId: string;
  content: string;
  receiverId: string;
}

export class SendMessageCommand {
  constructor(public readonly props: Props) {}
}
