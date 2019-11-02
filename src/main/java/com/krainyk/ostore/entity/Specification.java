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
public class Specification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String name;

    @ManyToMany
    private List<Subcategory> subcategories = new ArrayList<>();

    @OneToMany(mappedBy = "specification")
    private List<SpecificationValue> specificationValues = new ArrayList<>();
}
