interface Props {
  readonly id: string;
  readonly content: string;
  readonly senderId: string;
  readonly receiverId: string;
  readonly createdAt: Date;
}

export class Message {
  private readonly props: Props;

  private constructor(props: Props) {
    this.props = {
      ...props,
      createdAt: new Date(props.createdAt),
    };
  }

  public snapshot(): Readonly<Props> {
    return {
      ...this.props,
      createdAt: new Date(this.props.createdAt),
    };
  }

  public static create(props: Props) {
    if (!props.content.trim()) {
      throw new Error('Empty message');
    }

    return new Message(props);
  }

  public static rehydrate(props: Props) {
    return new Message(props);
  }
}
