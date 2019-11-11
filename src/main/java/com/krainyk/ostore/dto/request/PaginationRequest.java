package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class PaginationRequest {
    @NotNull
    private Integer size;
    @NotNull
    private Integer page;
    private Sort.Direction direction;
    private String fieldName;

    public Pageable toPageable() {
        if (fieldName != null && direction != null) {
            return PageRequest.of(page, size, direction, fieldName);
        } else if (fieldName != null) {
            return PageRequest.of(page, size, Sort.Direction.ASC, fieldName);
        } else {
            return PageRequest.of(page, size);
        }
    }
}
