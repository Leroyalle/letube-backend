export type CodeType = 'reset_password' | 'verify_email';

interface Props {
  id: string;
  type: CodeType;
  code: string;
  expiresAt: Date;
  userId: string;
}

interface Data {
  id: string;
  type: Props['type'];
  code: string;
  userId: string;
  expiresAt: Date;
}

export class VerificationCode {
  public readonly data: Data;

  private constructor(data: Data) {
    this.data = data;
  }

  public static create(props: Props) {
    return new VerificationCode({
      id: props.id,
      type: props.type,
      code: props.code,
      expiresAt: props.expiresAt,
      userId: props.userId,
    });
  }
}
