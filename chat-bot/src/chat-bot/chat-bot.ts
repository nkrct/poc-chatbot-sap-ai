import { Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {MatIcon} from '@angular/material/icon';


type Drag = { active: boolean; dx: number; dy: number };
type Size = { active: boolean; w: number; h: number; sx: number; sy: number };

@Component({
    selector: 'app-chat',
    standalone: true,
    templateUrl: './chat-bot.html',
    styleUrls: ['./chat-bot.css'],
  imports: [
    NgForOf,
    MatIcon,
    NgIf
  ]
})
export class ChatComponent {
    open = false;
    minimized = false;
    messages: { who: 'user' | 'bot'; text: string }[] = [];

    @ViewChild('chatInput') chatInput?: ElementRef<HTMLInputElement>;
    @ViewChild('chatBody') chatBody?: ElementRef<HTMLElement>;
    @ViewChild('chatWindow') chatWindow?: ElementRef<HTMLElement>;

    private drag: Drag = { active: false, dx: 0, dy: 0 };
    private size: Size = { active: false, w: 360, h: 480, sx: 0, sy: 0 };

    toggle() {
        this.open = !this.open;
        if (this.open) setTimeout(() => this.chatInput?.nativeElement.focus());
    }
    close() { this.open = false; }

    send(inputEl: HTMLInputElement) {
        const v = inputEl.value.trim();
        if (!v) return;
        this.messages.push({ who: 'user', text: v });
        inputEl.value = '';
        setTimeout(() => {
            this.messages.push({ who: 'bot', text: 'Bot: '});
            this.scrollToBottom();
        }, 200);
        this.scrollToBottom();
    }

    startDrag(ev: MouseEvent) {
        const win = this.chatWindow?.nativeElement;
        if (!win) return;
        const r = win.getBoundingClientRect();
        this.drag = { active: true, dx: ev.clientX - r.left, dy: ev.clientY - r.top };
        document.body.style.userSelect = 'none';
    }

    startResize(ev: MouseEvent) {
        const win = this.chatWindow?.nativeElement;
        if (!win) return;
        const r = win.getBoundingClientRect();
        this.size = { active: true, w: r.width, h: r.height, sx: ev.clientX, sy: ev.clientY };
        document.body.style.userSelect = 'none';
    }

    @HostListener('window:mousemove', ['$event'])
    onMove(ev: MouseEvent) {
        const win = this.chatWindow?.nativeElement;
        if (!win) return;

        if (this.drag.active) {
            const x = Math.min(window.innerWidth - 40, Math.max(10, ev.clientX - this.drag.dx));
            const y = Math.min(window.innerHeight - 40, Math.max(10, ev.clientY - this.drag.dy));
            Object.assign(win.style, { left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto' });
        }

        if (this.size.active) {
            const w = Math.max(280, this.size.w + (ev.clientX - this.size.sx));
            const h = Math.max(320, this.size.h + (ev.clientY - this.size.sy));
            Object.assign(win.style, { width: `${w}px`, height: `${h}px` });
        }
    }

    @HostListener('window:mouseup')
    onUp() {
        if (this.drag.active || this.size.active) document.body.style.userSelect = '';
        this.drag.active = false;
        this.size.active = false;
    }

    private scrollToBottom() {
        const el = this.chatBody?.nativeElement;
        if (el) el.scrollTop = el.scrollHeight;
    }

}
