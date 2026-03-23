interface Props {
  password: string;
  code: string;
  email: string;
}

export class ConfirmPasswordReset {
  constructor(public readonly props: Props) {}
}
