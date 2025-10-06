import { Component} from '@angular/core';
import {ChatComponent} from '../chat-bot/chat-bot';

@Component({
  selector: 'app-root',
  imports: [ChatComponent],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {}
