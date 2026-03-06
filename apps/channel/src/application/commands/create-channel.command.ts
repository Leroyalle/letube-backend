export class CreateChannelCommand {
  constructor(
    public readonly userId: string,
    public readonly name: string,
    public readonly description: string,
  ) {}
}
