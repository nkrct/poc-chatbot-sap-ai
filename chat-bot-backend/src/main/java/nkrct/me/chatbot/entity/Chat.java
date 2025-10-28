package nkrct.me.chatbot.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@Table(name = "chats")
public class Chat {
    @Id
    private Long id;
    private String username;
    private LocalDateTime createdAt;

    @ElementCollection
    private List<Message> messages = new ArrayList<>();

    public Chat() {
    }

    public void saveMessage(Message message) {
        messages.add(message);
    }
}
