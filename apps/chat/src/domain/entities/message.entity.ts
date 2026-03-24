interface Props {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export class MessageEntity {
  constructor(public readonly props: Props) {}
}
