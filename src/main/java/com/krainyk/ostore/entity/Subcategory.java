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
public class Subcategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false)
    private String name;

    @ManyToOne
    private Category category;

    @OneToMany(mappedBy = "subcategory")
    private List<Product> products = new ArrayList<>();

    @ManyToMany(mappedBy = "subcategories")
    private List<Specification> specifications = new ArrayList<>();
}
