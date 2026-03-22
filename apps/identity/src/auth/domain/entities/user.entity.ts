interface Props {
  id: string;
  name: string;
  email: string;
  password: string;
}

export class UserEntity {
  constructor(private readonly props: Props) {}

  public changePassword(hashedPassword: string) {
    this.props.password = hashedPassword;
  }

  public changeName(name: string) {
    this.props.name = name;
  }
}
