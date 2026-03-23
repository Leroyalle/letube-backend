interface Props {
  password: string;
  email: string;
}

export class ResetPasswordCommand {
  constructor(public readonly props: Props) {}
}
