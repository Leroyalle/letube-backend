export class PublishStreamCommand {
  constructor(
    public readonly props: {
      streamKey: string;
    },
  ) {}
}
