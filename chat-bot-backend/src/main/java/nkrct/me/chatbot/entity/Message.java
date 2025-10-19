package nkrct.me.chatbot.entity;


import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Embeddable
@Getter
@Setter
@Builder
@AllArgsConstructor
public class Message {
    String message;
    String sender;
    LocalDateTime createdAt;

    public Message() {
    }

}
