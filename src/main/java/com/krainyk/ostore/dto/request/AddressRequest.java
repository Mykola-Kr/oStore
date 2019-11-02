package com.krainyk.ostore.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    private String region;
    private String city;
    private String street;
    private Integer houseNumber;
    private Integer apartmentNumber;
}
