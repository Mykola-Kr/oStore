package com.krainyk.ostore.dto.respond;

import com.krainyk.ostore.entity.Order;
import com.krainyk.ostore.entity.OrderStatus;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderStatusRespond {
    private Long id;
    private String status;
    private List<Long> orders;

    public OrderStatusRespond(OrderStatus orderStatus) {
        this.id = orderStatus.getId();
        this.status = orderStatus.getStatus();
        this.orders = orderStatus.getOrders().stream().map(Order::getId).collect(Collectors.toList());
    }
}
