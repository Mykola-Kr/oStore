package com.krainyk.ostore.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

public class SpecificationValue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String value;

    @ManyToOne
    private Specification specification;

    @ManyToMany(mappedBy = "specificationValues")
    private List<Product> products = new ArrayList<>();
}
