import {Component} from '@angular/core';
import {ChatBot} from '../chat-bot/chat-bot';

@Component({
  selector: 'app-root',
  imports: [ChatBot],
  templateUrl: './app.html',
  standalone: true,
  styleUrl: './app.css'
})
export class App {}
