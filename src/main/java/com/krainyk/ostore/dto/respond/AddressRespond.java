package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Address;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRespond {
    private Long id;
    private String region;
    private String city;
    private String street;
    private Integer houseNumber;
    private Integer apartmentNumber;

    public AddressRespond(Address address) {
        this.id = address.getId();
        this.region = address.getRegion();
        this.city = address.getCity();
        this.street = address.getStreet();
        this.houseNumber = address.getHouseNumber();
        this.apartmentNumber = address.getApartmentNumber();
    }
}
