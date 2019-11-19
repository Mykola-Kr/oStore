package com.krainyk.ostore.dto.respond;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.krainyk.ostore.entity.Order;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Setter
public class OrderRespond {
    private Long id;
    private String comment;
    private Long userId;
    private Long addressId;
    private Long orderStatusId;
    private Long deliveryId;
    private Integer discount;
    private Double totalPrice;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime orderDate;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime shippedDate;
    private List<ProductCountRespond> productCountRespondList;

    public OrderRespond(Order order) {
        this.id = order.getId();
        this.comment = order.getComment();
        this.userId = order.getUser().getId();
        this.addressId = order.getAddress().getId();
        this.orderStatusId = order.getOrderStatus().getId();
        this.deliveryId = order.getDelivery().getId();
        this.discount = order.getDiscount();
        this.totalPrice = order.getTotalPrice();
        this.orderDate = order.getOrderDate();
        this.shippedDate = order.getShippedDate();
        this.productCountRespondList = order.getProductCountList().stream()
                .map(ProductCountRespond::new).collect(Collectors.toList());
    }
}
