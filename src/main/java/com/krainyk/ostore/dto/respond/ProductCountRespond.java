package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.ProductCount;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ProductCountRespond {
    private Long id;
    private Long productId;
    private Double unitPrice;
    private Integer quantity;

    public ProductCountRespond(ProductCount productCount) {
        this.id = productCount.getId();
        this.productId = productCount.getProduct().getId();
        this.unitPrice = productCount.getUnitPrice();
        this.quantity = productCount.getQuantity();
    }
}
