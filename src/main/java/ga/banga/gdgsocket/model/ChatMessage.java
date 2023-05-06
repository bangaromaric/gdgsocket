package ga.banga.gdgsocket.model;

/**
 * @author Romaric BANGA
 * @version 1.0
 * @since 5/6/23
 */
public class ChatMessage {
    private String content;
    private String sender;
    private Integer nbrMsg =0;
    private MessageType type;

    public enum MessageType {
        CHAT, LEAVE, JOIN
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public Integer getNbrMsg() {
        return nbrMsg;
    }

    public void setNbrMsg(Integer nbrMsg) {
        this.nbrMsg = nbrMsg;
    }

    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }
}
