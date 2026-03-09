type VideoStatus = 'READY' | 'ERROR' | 'UPLOADING' | 'PROCESSING';

interface VideoData {
  id: string;
  description: string;
  name: string;
  sourceKey: string;
  hlsMasterKey: string | null;
  status: VideoStatus;
  channelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Video {
  constructor(public readonly props: VideoData) {}

  public changeStatus(status: VideoStatus) {
    this.props.status = status;
  }

  public canStartProcessing(): boolean {
    return this.props.status === 'UPLOADING';
  }
}
