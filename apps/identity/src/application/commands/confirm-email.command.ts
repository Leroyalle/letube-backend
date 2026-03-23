interface Props {
  code: string;
  email: string;
}

export class ConfirmEmailCommand {
  constructor(public readonly props: Props) {}
}
