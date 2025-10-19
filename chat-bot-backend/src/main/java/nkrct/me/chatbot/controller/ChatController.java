package nkrct.me.chatbot.controller;

import nkrct.me.chatbot.entity.Chat;
import nkrct.me.chatbot.service.ChatService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestParam String username, @RequestParam String createdAt, @RequestParam String id) {
        Chat chat = chatService.createChat(username, createdAt, id);
        return new ResponseEntity<>(chat, HttpStatus.CREATED);
    }

    @PostMapping("/message")
    public ResponseEntity<Chat> saveMessage(@RequestParam String message, @RequestParam String sender, @RequestParam String sendAt, @RequestParam String chatId) {
        Chat chat = chatService.saveMessage(message, sender, sendAt, chatId);
        return new ResponseEntity<>(chat, HttpStatus.OK);
    }
}