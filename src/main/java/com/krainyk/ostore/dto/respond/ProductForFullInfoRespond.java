package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Product;
import lombok.Getter;
import lombok.Setter;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class ProductForFullInfoRespond {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Double rating;
    private String img;
    private Integer quantity;
    private String categoryName;
    private SubcategoryRespond subcategoryRespond;
    private ProductLabelRespond productLabelRespond;
    private List<SpecificationValueRespond> specificationValueResponds;
    private List<CommentRespond> commentResponds;

    public ProductForFullInfoRespond(Product product) {
        this.id = product.getId();
        this.name = product.getName();
        this.description = product.getDescription();
        this.price = product.getPrice();
        this.rating = product.getRating();
        this.img = product.getImg();
        this.quantity = product.getQuantity();
        this.categoryName = product.getSubcategory().getCategory().getName();
        this.subcategoryRespond = new SubcategoryRespond(product.getSubcategory());
        this.productLabelRespond = new ProductLabelRespond(product.getLabel());
        this.specificationValueResponds = product.getSpecificationValues().stream()
                .map(SpecificationValueRespond::new).collect(Collectors.toList());
        this.commentResponds = product.getComments().stream().map(CommentRespond::new).collect(Collectors.toList());
    }
}
