package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Specification;
import com.krainyk.ostore.entity.Subcategory;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class SpecificationRespond {
    private Long id;
    private String name;
    private List<Long> subcategoriesIds;

    public SpecificationRespond(Specification specification) {
        this.id = specification.getId();
        this.name = specification.getName();
        this.subcategoriesIds = specification.getSubcategories().stream().map(Subcategory::getId).collect(Collectors.toList());
    }
}
