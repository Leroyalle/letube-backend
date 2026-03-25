interface Props {
  receiverId: string;
}

export class GetMessagesByReceiverIdQuery {
  constructor(public readonly props: Props) {}
}
