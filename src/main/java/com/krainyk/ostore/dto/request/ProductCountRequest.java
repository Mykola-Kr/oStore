package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ProductCountRequest {
    @NotNull
    private Long productId;
    @NotNull
    private Integer quantity;
}
