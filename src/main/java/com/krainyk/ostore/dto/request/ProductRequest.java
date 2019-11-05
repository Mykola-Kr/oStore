package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.*;
import java.util.List;

@Getter
@Setter
public class ProductRequest {

    @NotBlank
    private String name;
    @NotNull
    @DecimalMin("0.1")
    private Double price;
    private String description;
    private String img;
    private Integer quantity;
    @NotNull
    private Long subcategoryId;
    private Long productLabelId;
    private List<Long> specificationsValuesIds;
}
