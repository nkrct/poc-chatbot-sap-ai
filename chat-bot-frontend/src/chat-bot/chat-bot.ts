import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type Who = 'user' | 'bot';

interface Message {
  who: Who;
  text: string;
  ts: number;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
}

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
  activeChatId: string | null = null;

  constructor() {
    this.restore();
    if (this.chats.length === 0) {
      const first = this.createChat('New Chat');
      this.chats.push(first);
      this.activeChatId = first.id;
      this.persist();
    }
  }

  get activeChat(): Chat | undefined {
    return this.chats.find(c => c.id === this.activeChatId);
  }

  toggle(): void { this.open = !this.open; }
  close(): void { this.open = false; }

  newChat(): void {
    const c = this.createChat('New Chat');
    this.chats.unshift(c);
    this.activeChatId = c.id;
    this.persist();
  }

  selectChat(id: string): void {
    if (this.activeChatId === id) return;
    this.activeChatId = id;
    this.persist(false);
  }

  send(inputEl: HTMLInputElement): void {
    const value = (inputEl.value || '').trim();
    if (!value) return;
    const chat = this.activeChat;
    if (!chat) return;
    chat.messages.push({ who: 'user', text: value, ts: Date.now() });
    if (chat.title === 'New Chat') chat.title = this.deriveTitle(value);
    chat.messages.push({ who: 'bot', text: 'Response', ts: Date.now() + 1 });
    inputEl.value = '';
    this.persist();
    setTimeout(() => {
      const body = document.getElementById('chat-body');
      if (body) body.scrollTop = body.scrollHeight;
    });
  }

  private createChat(title: string): Chat {
    return { id: crypto.randomUUID(), title, messages: [] };
  }

  private deriveTitle(seed: string): string {
    const clean = seed.replace(/\s+/g, ' ').trim();
    return clean.length > 28 ? clean.slice(0, 27) + '…' : (clean || 'New Chat');
  }

  private persist(updateTimestamp = true): void {
    const payload = { chats: this.chats, activeChatId: this.activeChatId, ts: updateTimestamp ? Date.now() : undefined };
    try { localStorage.setItem('chatbot_state', JSON.stringify(payload)); } catch {}
  }

  private restore(): void {
    try {
      const raw = localStorage.getItem('chatbot_state');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.chats)) this.chats = parsed.chats;
      if (typeof parsed?.activeChatId === 'string') this.activeChatId = parsed.activeChatId;
    } catch {}
  }
}
