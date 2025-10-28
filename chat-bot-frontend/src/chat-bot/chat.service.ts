import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private baseUrl = 'http://localhost:8080/chat';

  constructor(private http: HttpClient) {}

  async createChat(username: string, createdAt: string, id: string): Promise<any> {
    const params = new HttpParams()
      .set('username', username)
      .set('createdAt', createdAt)
      .set('id', id);
    return firstValueFrom(this.http.post(`${this.baseUrl}/create`, null, { params }));
  }

  async sendMessage(message: string, sender: string, sendAt: string, chatId: string): Promise<any> {
    const params = new HttpParams()
      .set('message', message)
      .set('sender', sender)
      .set('sendAt', sendAt)
      .set('chatId', chatId);
    return firstValueFrom(this.http.post(`${this.baseUrl}/message`, null, { params }));
  }

  async getChats(username: string): Promise<any> {
    const params = new HttpParams().set('username', username);
    return firstValueFrom(this.http.get(`${this.baseUrl}/get_chats`, { params }));
  }
}
