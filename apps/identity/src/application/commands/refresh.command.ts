interface Props {
  refreshToken: string;
}
export class RefreshCommand {
  constructor(public readonly props: Props) {}
}
