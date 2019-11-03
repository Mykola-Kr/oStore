package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Comment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class CommentRespond {
    private Long id;
    private Integer mark;
    private String description;
    private LocalDateTime dateTime;
    private Long productId;
    private Long userId;
    private Boolean isPublished;

    public CommentRespond(Comment comment) {
        this.id = comment.getId();
        this.mark = comment.getMark();
        this.description = comment.getDescription();
        this.dateTime = comment.getDateTime();
        this.productId = comment.getProduct().getId();
        this.userId = comment.getUser().getId();
        this.isPublished = comment.getIsPublished();
    }
}
