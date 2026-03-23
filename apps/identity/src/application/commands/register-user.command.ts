interface Props {
  email: string;
  name: string;
  password: string;
}

export class RegisterUserCommand {
  constructor(public readonly props: Props) {}
}
