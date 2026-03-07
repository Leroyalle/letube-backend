interface VideoData {
  id: string;
  description: string;
  name: string;
  channelId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Video {
  constructor(public readonly props: VideoData) {}
}
