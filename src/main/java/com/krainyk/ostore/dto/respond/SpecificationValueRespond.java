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
    private List<Long> productsIds;

    public SpecificationValueRespond(SpecificationValue specificationValue) {
        this.id = specificationValue.getId();
        this.value = specificationValue.getValue();
        this.specificationId = specificationValue.getSpecification().getId();
        this.productsIds = specificationValue.getProducts().stream().map(Product::getId).collect(Collectors.toList());
    }
}
