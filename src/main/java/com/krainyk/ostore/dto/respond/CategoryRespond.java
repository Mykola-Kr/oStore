package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Category;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryRespond {
    private Long id;
    private String name;

    public CategoryRespond(Category category) {
        this.id = category.getId();
        this.name = category.getName();
    }
}
