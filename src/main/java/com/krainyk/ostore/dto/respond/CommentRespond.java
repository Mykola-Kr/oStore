package com.krainyk.ostore.dto.respond;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.krainyk.ostore.entity.Comment;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class CommentRespond {
    private Long id;
    private Integer mark;
    private String description;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime dateTime;
    private Long productId;
    private Long userId;
    private String userName;
    private Boolean isAllowed;

    public CommentRespond(Comment comment) {
        this.id = comment.getId();
        this.mark = comment.getMark();
        this.description = comment.getDescription();
        this.dateTime = comment.getDateTime();
        this.productId = comment.getProduct().getId();
        this.userId = comment.getUser().getId();
        this.userName = comment.getUser().getUsername();
        this.isAllowed = comment.getIsAllowed();
    }
}
