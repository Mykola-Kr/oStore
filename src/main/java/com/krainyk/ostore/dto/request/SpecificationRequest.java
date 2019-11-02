package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SpecificationRequest {
    private String name;
    private List<Long> subcategoriesIds;
}
