package nkrct.me.chatbot.service;


import nkrct.me.chatbot.entity.Chat;
import nkrct.me.chatbot.entity.Message;
import nkrct.me.chatbot.repo.ChatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    public Chat saveMessage(String message, String sender, String sendAt, String chatId) {

        Message messageEnt = Message.builder().createdAt(LocalDateTime.parse(sendAt)).message(message).sender(sender).build();
        Chat chat = new Chat();
        chat.setId(Long.parseLong(chatId));
        chat.saveMessage(messageEnt);
        chatRepository.save(chat);
        return chat;
    }

    public Chat createChat(String username, String createdAt, String id) {
        Chat chat = Chat.builder().username(username).createdAt(LocalDateTime.parse(createdAt)).id(Long.parseLong(id)).messages(new ArrayList<>()).build();
        chatRepository.save(chat);
        return chat;
    }
}
