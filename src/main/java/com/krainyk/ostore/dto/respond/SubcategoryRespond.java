package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Subcategory;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SubcategoryRespond {
    private Long id;
    private String name;
    private Long categoryId;

    public SubcategoryRespond(Subcategory subcategory) {
        this.id = subcategory.getId();
        this.name = subcategory.getName();
        this.categoryId = subcategory.getCategory().getId();
    }
}
