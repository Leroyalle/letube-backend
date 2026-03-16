interface IStream {
  id: string;
  channelId: string;
  streamKey: string;
  status: string;
}

export class Stream {
  constructor(private readonly props: IStream) {}
}
