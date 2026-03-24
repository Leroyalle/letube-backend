interface Props {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export class MessageEntity {
  private constructor(public readonly props: Props) {}

  public static create(props: Props) {
    return new MessageEntity(props);
  }
}
