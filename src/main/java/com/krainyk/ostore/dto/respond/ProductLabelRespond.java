package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.ProductLabel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductLabelRespond {
    private Long id;
    private String name;

    public ProductLabelRespond(ProductLabel productLabel) {
        this.id = productLabel.getId();
        this.name = productLabel.getName();
    }
}
