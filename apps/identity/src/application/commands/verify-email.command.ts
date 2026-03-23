interface Props {
  email: string;
  name: string;
  password: string;
}

export class VerifyEmailCommand {
  constructor(public readonly props: Props) {}
}
