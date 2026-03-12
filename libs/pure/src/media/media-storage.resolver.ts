import { HLS_PLAYLIST_NAME } from './constants/hls.constant';

type ContentType = 'video' | 'image';

export class MediaStorageResolver {
  private static readonly UPLOAD_PREFIX = 'upload';
  private static readonly STREAMS_PREFIX = 'streams';

  private static readonly CONTENT_PREFIX = {
    video: 'video',
    image: 'image',
  };

  public static generateUploadKey(id: string, filename: string, content: ContentType): string {
    const parsed = filename.split('.');
    const ext = parsed.pop();
    const contentPrefix = this.CONTENT_PREFIX[content];
    const key = `${this.UPLOAD_PREFIX}/${contentPrefix}/${id}/original.${ext}`;
    return key;
  }

  public static createHlsFolderKey(id: string, content: ContentType): string {
    const contentPrefix = this.CONTENT_PREFIX[content];
    return `${this.STREAMS_PREFIX}/${contentPrefix}/${id}`;
  }

  public static createPlaylistKey(id: string, content: ContentType): string {
    return `${this.createHlsFolderKey(id, content)}/${HLS_PLAYLIST_NAME}`;
  }
}
