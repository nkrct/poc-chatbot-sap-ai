type Who = 'user' | 'bot';

interface Message {
  who: Who;
  text: string;
  ts: number;
}
