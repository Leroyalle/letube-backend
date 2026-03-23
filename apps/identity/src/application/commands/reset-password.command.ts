interface Props {
  password: string;
  email: string;
}

export class ForgotPasswordCommand {
  constructor(public readonly props: Props) {}
}
