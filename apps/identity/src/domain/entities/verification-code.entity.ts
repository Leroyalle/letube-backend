interface Props {
  type: 'verify_email' | 'reset_password';
}

interface Data {
  type: Props['type'];
  code: string;
  expiresAt: Date;
}

export class VerificationCode {
  public readonly data: Data;

  private constructor(data: Data) {
    this.data = data;
  }

  public static create(props: Props) {
    const code = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    return new VerificationCode({
      type: props.type,
      code,
      expiresAt,
    });
  }
}
