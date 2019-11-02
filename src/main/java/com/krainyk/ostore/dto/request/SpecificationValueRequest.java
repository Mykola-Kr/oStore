package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class SpecificationValueRequest {
    @NotBlank
    private String value;
    @NotNull
    private Long specificationId;
}
