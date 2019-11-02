package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class OrderStatusRquest {
    @NotBlank
    private String status;
}
