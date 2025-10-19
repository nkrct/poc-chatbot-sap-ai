package nkrct.me.chatbot.entity;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Chat {
    @Id
    private Long id;
    private String username;
    private LocalDateTime createdAt;

    @ElementCollection
    private List<Message> messages;

    public Chat() {
    }

    public void saveMessage(Message message) {
        messages.add(message);
    }
}
