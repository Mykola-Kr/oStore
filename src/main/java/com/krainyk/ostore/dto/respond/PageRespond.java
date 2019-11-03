package com.krainyk.ostore.dto.respond;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class PageRespond<T> {
    private Long totalElements;
    private Integer totalPages;
    private List<T> data;
}
