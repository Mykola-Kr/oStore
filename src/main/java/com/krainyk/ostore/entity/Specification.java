package com.krainyk.ostore.entity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

public class Specification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @ManyToMany
    private List<Subcategory> subcategories = new ArrayList<>();

    @OneToMany(mappedBy = "specification")
    private List<SpecificationValue> specificationValues = new ArrayList<>();
}
