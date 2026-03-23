export type TRole = 'USER' | 'ADMIN' | 'MODERATOR';

interface Props {
  id: string;
  name: string;
  email: string;
  password: string;
  isBanned: boolean;
  isVerified: boolean;
  role: TRole;
}

export class User {
  private constructor(public readonly props: Props) {}

  public static create(props: Props) {
    return new User({
      email: props.email,
      id: props.id,
      name: props.name,
      password: props.password,
      isBanned: props.isBanned,
      isVerified: props.isVerified,
      role: props.role,
    });
  }

  public changePassword(hashedPassword: string) {
    this.props.password = hashedPassword;
  }

  public changeName(name: string) {
    this.props.name = name;
  }
}
