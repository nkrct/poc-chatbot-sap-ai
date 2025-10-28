export interface ChatDto {
  id: number;
  username: string;
  createdAt: string;
  messages: Array<{ sender: string; message: string; createdAt: string }>;
}
