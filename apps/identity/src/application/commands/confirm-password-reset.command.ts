interface Props {
  password: string;
  code: string;
  email: string;
}

export class ConfirmPasswordResetCommand {
  constructor(public readonly props: Props) {}
}
