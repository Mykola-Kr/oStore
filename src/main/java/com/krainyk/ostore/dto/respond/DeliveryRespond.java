package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Delivery;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DeliveryRespond {
    private Long id;
    private String name;

    public DeliveryRespond(Delivery delivery) {
        this.id = delivery.getId();
        this.name = delivery.getName();
    }
}
