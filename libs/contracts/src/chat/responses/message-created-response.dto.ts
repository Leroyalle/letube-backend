export class MessageCreatedResponseDto {
  id!: string;
  content!: string;
  senderId!: string;
  receiverId!: string;
  createdAt!: Date;
}
