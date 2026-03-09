import { Injectable } from '@nestjs/common';

import type { ContentType } from '../../../domain/value-objects/content-type.vo';
import { HLS_PLAYLIST_NAME } from '../../constants/hls.constant';

@Injectable()
export class MediaStorageResolver {
  private readonly UPLOAD_PREFIX = 'upload';
  private readonly STREAMS_PREFIX = 'streams';

  private readonly CONTENT_PREFIX = {
    video: 'video',
    image: 'image',
  };

  public generateUploadKey(id: string, filename: string, content: ContentType): string {
    const parsed = filename.split('.');
    const ext = parsed.pop();
    const contentPrefix = this.CONTENT_PREFIX[content.getValue()];
    const key = `${this.UPLOAD_PREFIX}/${contentPrefix}/${id}/original.${ext}`;
    return key;
  }

  public createHlsFolderKey(id: string, content: ContentType): string {
    const contentPrefix = this.CONTENT_PREFIX[content.getValue()];
    return `${this.STREAMS_PREFIX}/${contentPrefix}/${id}`;
  }

  public createPlaylistKey(id: string, content: ContentType): string {
    return `${this.createHlsFolderKey(id, content)}/${HLS_PLAYLIST_NAME}`;
  }
}
