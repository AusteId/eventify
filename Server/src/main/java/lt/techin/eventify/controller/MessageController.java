package lt.techin.eventify.controller;


import lt.techin.eventify.dto.message.MessageRequest;
import lt.techin.eventify.dto.message.MessageResponse;
import lt.techin.eventify.model.Message;
import lt.techin.eventify.service.MessageService;
import lt.techin.eventify.util.WebUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/{recipientId}")
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request,
                                               @PathVariable Long recipientId) {
        Message message = messageService.sendMessage(recipientId,request);
        URI location = WebUtils.uriLocation("/{conversationId}",message.getConversationId());
        return ResponseEntity.created(location).body(message);
    }

    @GetMapping("/{recipientId}")
    public ResponseEntity<Page<MessageResponse>> getConversationMessages(@PathVariable Long recipientId,
                                                                         @RequestParam(defaultValue = "timestamp") String sortBy,
                                                                         @RequestParam(defaultValue = "asc")String direction,
                                                                         @RequestParam(defaultValue = "0") int page,
                                                                         @RequestParam(defaultValue = "4") int size) {
        Pageable pageable = PageRequest.of(page,size,direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC,sortBy);
        return ResponseEntity.ok(messageService.getConversation(recipientId,pageable));

    }
}
