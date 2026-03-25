interface Props {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date;
}

export class MessageCreatedEvent {
  constructor(public readonly props: Props) {}
}
