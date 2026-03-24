interface Props {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
}

export class Message {
  private constructor(public readonly props: Props) {}

  public static create(props: Props) {
    return new Message(props);
  }
}
