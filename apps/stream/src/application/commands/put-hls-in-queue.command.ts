export class PutHlsInQueueCommand {
  constructor(
    public readonly props: {
      streamKey: string;
      localPlaylistPath: string;
      localSegmentPath: string;
    },
  ) {}
}
