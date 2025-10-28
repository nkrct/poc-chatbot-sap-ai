package nkrct.me.chatbot.service;


import jakarta.transaction.Transactional;
import nkrct.me.chatbot.entity.Chat;
import nkrct.me.chatbot.entity.Message;
import nkrct.me.chatbot.repo.ChatRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ChatService {

    private final ChatRepository chatRepository;
    public ChatService(ChatRepository chatRepository) {
        this.chatRepository = chatRepository;
    }

    @Transactional
    public Chat saveMessage(String message, String sender, String sendAt, String chatId) {

        LocalDateTime time = OffsetDateTime.parse(sendAt, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                .withOffsetSameInstant(ZoneOffset.UTC)
                .toLocalDateTime();

        Message messageEnt = Message.builder().createdAt(time).message(message).sender(sender).build();
        Chat chat = new Chat();
        chat.setId(Long.parseLong(chatId));
        chat.saveMessage(messageEnt);
        chatRepository.save(chat);
        return chat;
    }

    public Chat createChat(String username, String createdAt, String id) {

        LocalDateTime time = OffsetDateTime.parse(createdAt, DateTimeFormatter.ISO_OFFSET_DATE_TIME)
                .withOffsetSameInstant(ZoneOffset.UTC).
                toLocalDateTime();

        Chat chat = Chat.builder().username(username).createdAt(time).id(Long.parseLong(id)).messages(new ArrayList<>()).build();
        chatRepository.save(chat);
        return chat;
    }

    public List<Chat> getChats(String username) {
        return chatRepository.getChatsByUsername(username);
    }
}
