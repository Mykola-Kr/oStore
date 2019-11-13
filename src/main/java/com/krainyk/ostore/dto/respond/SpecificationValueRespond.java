package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Product;
import com.krainyk.ostore.entity.SpecificationValue;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SpecificationValueRespond {
    private Long id;
    private String value;
    private Long specificationId;
    private String specificationName;
    private List<Long> productsIds;

    public SpecificationValueRespond(SpecificationValue specificationValue) {
        this.id = specificationValue.getId();
        this.value = specificationValue.getValue();
        this.specificationName = specificationValue.getSpecification().getName();
        this.specificationId = specificationValue.getSpecification().getId();
        this.productsIds = specificationValue.getProducts().stream().map(Product::getId).collect(Collectors.toList());
    }
}
