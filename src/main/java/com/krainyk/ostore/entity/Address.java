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
public class Address {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String country;
    private String region;
    private String city;
    private String street;
    private Integer houseNumber;
    private Integer apartmentNumber;

    @OneToMany(mappedBy = "address")
    private List<Order> orders = new ArrayList<>();
}
