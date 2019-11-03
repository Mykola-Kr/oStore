package com.krainyk.ostore.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;
    private Double price;
    @Column(columnDefinition = "text")
    private String description;
    private String img;
    private Double rating;
    private Integer quantity;

    @ManyToOne
    private Subcategory subcategory;

    @ManyToOne
    private ProductLabel label;

    @OneToMany(mappedBy = "product")
    private List<ProductCount> productCountList = new ArrayList<>();

    @OneToMany(mappedBy = "product")
    private List<Comment> comments = new ArrayList<>();

    @ManyToMany
    private List<SpecificationValue> specificationValues = new ArrayList<>();

}
