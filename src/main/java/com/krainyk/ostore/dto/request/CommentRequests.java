package com.krainyk.ostore.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.bind.DefaultValue;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
public class CommentRequests {
    private String description;
    @NotNull
    @Min(1)
    @Max(5)
    private Integer mark;
    @NotNull
    private Long productId;
    @NotNull
    private Long userId;
    private Boolean isAllowed;
}
