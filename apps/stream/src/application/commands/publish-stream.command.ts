export class PublishStreamCommand {
  constructor(
    public readonly props: {
      channelId: string;
      streamKey: string;
    },
  ) {}
}
