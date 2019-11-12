package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProductCriteriaRequest {
    private String name;
    private Double minPrice;
    private Double maxPrice;
    private Long categoryId;
    private Long subcategoryId;
    private Long productLabelId;
    private Integer minQuantity;
    private Integer maxQuantity;
    private List<Long> specificationValuesIds;
}
