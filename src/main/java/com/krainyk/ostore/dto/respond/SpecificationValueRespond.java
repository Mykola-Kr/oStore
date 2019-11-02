package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.SpecificationValue;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SpecificationValueRespond {
    private Long id;
    private String value;
    private Long specificationId;

    public SpecificationValueRespond(SpecificationValue specificationValue) {
        this.id = specificationValue.getId();
        this.value = specificationValue.getValue();
        this.specificationId = specificationValue.getSpecification().getId();
    }
}
