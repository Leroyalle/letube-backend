interface Props {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export class MessageCreatedEvent {
  constructor(public readonly props: Props) {}
}
