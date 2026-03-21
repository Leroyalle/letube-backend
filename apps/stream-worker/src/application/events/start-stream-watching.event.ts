export class StartStreamWatchingEvent {
  constructor(
    public readonly props: {
      streamKey: string;
      localPlaylistPath: string;
      localSegmentsPath: string;
      storagePlaylistPath: string;
      storageSegmentsPath: string;
    },
  ) {}
}
