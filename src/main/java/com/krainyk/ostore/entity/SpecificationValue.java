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
