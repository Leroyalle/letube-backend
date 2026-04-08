interface Props {
  password: string;
  code: string;
  email: string;
}

export class GetUserCommand {
  constructor(public readonly props: Props) {}
}
