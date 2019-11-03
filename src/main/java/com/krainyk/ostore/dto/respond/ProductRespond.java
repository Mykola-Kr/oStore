package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Product;
import com.krainyk.ostore.entity.SpecificationValue;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductRespond {

    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double rating;
    private String img;
    private Integer quantity;
    private Long subcategoryId;
    private Long productLabelId;
    private List<Long> specificationsValuesIds;

    public ProductRespond(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.rating = product.getRating();
        this.img = product.getImg();
        this.quantity = product.getQuantity();
        this.subcategoryId = product.getSubcategory().getId();
        this.productLabelId = product.getLabel().getId();
        this.specificationsValuesIds = product.getSpecificationValues().stream()
                                        .map(SpecificationValue::getId).collect(Collectors.toList());
    }
}
