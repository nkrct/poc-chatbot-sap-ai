import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ChatService } from './chat.service';
import { ChatDto } from './objects/chatdto';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './chat-bot.html',
  styleUrls: ['./chat-bot.css']
})
export class ChatBot {
  open = false;
  chats: Chat[] = [];
  activeChatId: number | null = null;
  username = 'guest';

  constructor(private chatService: ChatService) {
    this.restore();
  }

  get activeChat(): Chat | undefined {
    return typeof this.activeChatId === 'number'
      ? this.chats.find(c => c.id === this.activeChatId)
      : undefined;
  }

    async toggle(): Promise<void> {
      this.open = !this.open;
      if (!this.open) return;
    try {
      const data: ChatDto[] = await this.chatService.getChats(this.username);
      this.chats = data.map((d: ChatDto): Chat => this.mapDto(d)).sort((a: Chat, b: Chat) => b.id - a.id);
      if (this.chats.length === 0) {
        const c = await this.newChat();
        this.activeChatId = c.id;
      } else {
        this.activeChatId = this.chats[0].id;
      }
      this.persist();
    } catch {}
  }


    close(): void {
    this.open = false;
  }

  async newChat(): Promise<Chat> {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const createdAt = new Date().toISOString();
    const c: Chat = { id, title: 'New Chat', messages: [] };
    await this.chatService.createChat(this.username, createdAt, String(id));
    this.chats = [c, ...this.chats];
    this.activeChatId = c.id;
    this.persist();
    return c;
  }


  selectChat(id: number): void {
    if (this.activeChatId === id) return;
    this.activeChatId = id;
    this.persist(false);
  }

  private replaceActiveChat(updated: Chat): void {
    const i = this.chats.findIndex(x => x.id === updated.id);
    if (i === -1) return;
    const copy: Chat = { ...updated, messages: [...updated.messages] };
    this.chats = [...this.chats.slice(0, i), copy, ...this.chats.slice(i + 1)];
  }


  async send(inputEl: HTMLInputElement): Promise<void> {
    const value = (inputEl.value || '').trim();
    if (!value) return;

    let chat = this.activeChat;
    if (!chat) {
      chat = await this.newChat();
    }

    const userMsg: Message = { who: 'user', text: value, ts: Date.now() };
    chat.messages = [...(chat.messages || []), userMsg];
    if (chat.title === 'New Chat') chat.title = this.deriveTitle(value);
    this.replaceActiveChat(chat);

    const sendAt = new Date().toISOString();
    try {
      await this.chatService.sendMessage(value, this.username, sendAt, String(chat.id));
      const botMsg: Message = { who: 'bot', text: 'Message saved on server', ts: Date.now() + 1 };
      const updated: Chat = { ...this.activeChat!, messages: [...(this.activeChat!.messages || []), botMsg] };
      this.replaceActiveChat(updated);
      this.persist();
      setTimeout(() => {
        const body = document.getElementById('chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      });
    } catch {}

    inputEl.value = '';
  }




  private mapDto(d: ChatDto): Chat {
    const msgs: Message[] = Array.isArray(d.messages)
      ? d.messages.map(m => ({
        who: m.sender === this.username ? 'user' : 'bot',
        text: m.message ?? '',
        ts: Date.parse(m.createdAt || '')
      }))
      : [];
    return { id: d.id, title: this.buildTitle(d, msgs), messages: msgs };
  }


  private buildTitle(d: ChatDto, msgs: Message[]): string {
    if (msgs.length > 0) {
      const t = msgs[0].text.trim();
      return t.length > 28 ? t.slice(0, 27) + '…' : t || 'Chat';
    }
    const dt = d.createdAt ? new Date(d.createdAt) : new Date();
    const iso = isNaN(dt.getTime()) ? '' : dt.toISOString().slice(0, 16).replace('T', ' ');
    return iso ? `Chat ${iso}` : 'Chat';
  }

  private deriveTitle(seed: string): string {
    const clean = seed.replace(/\s+/g, ' ').trim();
    return clean.length > 28 ? clean.slice(0, 27) + '…' : (clean || 'New Chat');
  }

  private persist(updateTimestamp = true): void {
    const payload = { activeChatId: this.activeChatId, ts: updateTimestamp ? Date.now() : undefined };
    try { localStorage.setItem('chatbot_state', JSON.stringify(payload)); } catch {}
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem('chatbot_state');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (typeof parsed?.activeChatId === 'number') this.activeChatId = parsed.activeChatId;
    } catch {}
  }
}
