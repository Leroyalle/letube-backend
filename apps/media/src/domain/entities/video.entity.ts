// type VideoStatus = 'READY' | 'ERROR' | 'UPLOADING' | 'UPLOADED' | 'PROCESSED' | 'PROCESSING';
type VideoStatus = 'READY' | 'ERROR' | 'UPLOADING' | 'UPLOADED';

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
    return this.props.status === 'UPLOADED';
  }

  public canMakeUploaded(): boolean {
    return this.props.status === 'UPLOADING';
  }

  public canMakeReady(): boolean {
    // FIXME: изменить на PROCESSED
    return this.props.status === 'UPLOADED';
  }

  public setMasterKey(masterKey: string) {
    return (this.props.hlsMasterKey = masterKey);
  }
}
