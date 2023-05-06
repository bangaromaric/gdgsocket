package ga.banga.gdgsocket.controller;

import ga.banga.gdgsocket.model.ChatMessage;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @author Romaric BANGA
 * @version 1.0
 * @since 5/6/23
 */
@Controller
public class ChatController {
        private List<ChatMessage> utilisateurs = new ArrayList<>();
        private List<ChatMessage> messages = new ArrayList<>();

        @MessageMapping("/chat.register")
        @SendTo("/topic/public")
        public List<ChatMessage> register(@Payload ChatMessage chatMessage, SimpMessageHeaderAccessor headerAccessor) {
            Objects.requireNonNull(headerAccessor.getSessionAttributes()).put("username", chatMessage.getSender());
            utilisateurs.add(chatMessage);
            System.out.println(utilisateurs.toString());
            return utilisateurs;
        }

        @MessageMapping("/chat.send")
        @SendTo("/topic/public")
        public List<ChatMessage> sendMessage(@Payload ChatMessage chatMessage) {
            messages.add(chatMessage);
            Integer  found = 0;

            for (ChatMessage message : messages) {
                if (message.getSender().equals(chatMessage.getSender())){
                    found = message.getNbrMsg();
                    break;
                }
            }
            for (ChatMessage message : messages) {
                if (message.getSender().equals(chatMessage.getSender())){
                    message.setNbrMsg(found+1);
                }
            }

            System.out.println("la liste:" +messages.toString());

            return messages;
        }


}
