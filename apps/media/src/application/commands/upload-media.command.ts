export class UploadMediaCommand {
  constructor(
    public readonly filename: string,
    public readonly contentType: string,
  ) {}
}
