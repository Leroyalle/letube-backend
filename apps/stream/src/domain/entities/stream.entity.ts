type StreamStatus = 'REQUESTED' | 'PUBLISHED' | 'ERROR' | 'STOPPED';

interface IStream {
  id: string;
  channelId: string;
  streamKey: string;
  status: StreamStatus;
  playlistPath: string;
  segmentsPath: string;
}

export class Stream {
  constructor(public readonly props: IStream) {}

  public changeStatus(value: StreamStatus) {
    this.props.status = value;
  }
}
