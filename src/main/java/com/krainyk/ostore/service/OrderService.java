package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.OrderRequest;
import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.request.ProductCountRequest;
import com.krainyk.ostore.dto.respond.OrderRespond;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.entity.Order;
import com.krainyk.ostore.entity.ProductCount;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.OrderRepository;
import com.krainyk.ostore.repository.ProductCountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private ProductCountRepository productCountRepository;
    @Autowired
    private ProductService productService;
    @Autowired
    private AddressService addressService;
    @Autowired
    private DeliveryService deliveryService;
    @Autowired
    private OrderStatusService orderStatusService;
    @Autowired
    private UserService userService;

    public void shipped(Long id) {
        Order order = findOne(id);
        order.setShippedDate(LocalDateTime.now(ZoneId.of("Europe/Kiev")));
        orderRepository.save(order);
    }

    public PageRespond<OrderRespond> findPage(PaginationRequest request) {
        Page<Order> data = orderRepository.findAll(request.toPageable());
        return pageToPageRespond(data);
    }

    private PageRespond<OrderRespond> pageToPageRespond(Page<Order> data) {
        List<OrderRespond> respondList = data.get().map(OrderRespond::new).collect(Collectors.toList());
        return new PageRespond<>(data.getTotalElements(), data.getTotalPages(), respondList);
    }

    public OrderRespond findOneRespond(Long id) {
        return new OrderRespond(findOne(id));
    }

    public void update(Long id, OrderRequest request) {
        Order order = orderRepository.save(orderRequestToOrder(findOne(id), request));
        createProductCount(order, request);
    }

    public Order findOne(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new NoMatchesException("Order with id " + id + " does not exist"));
    }

    public void createOrder(OrderRequest request) {
        Order order = orderRepository.save(orderRequestToOrder(null, request));
        createProductCount(order, request);
    }

    private Order orderRequestToOrder(Order order, OrderRequest request) {
        if (order == null) {
            order = new Order();
            order.setOrderDate(LocalDateTime.now(ZoneId.of("Europe/Kiev")));
        }
        order.setAddress(addressService.findOne(request.getAddressId()));
        order.setDelivery(deliveryService.findOne(request.getDeliveryId()));
        order.setOrderStatus(orderStatusService.findOne(request.getOrderStatusId()));
        order.setUser(userService.findOne(request.getUserId()));
        order.setComment(request.getComment());
        if (request.getDiscount() == null) {
            order.setTotalPrice(totalPrice(request.getProductsFororder()));
        } else {
            order.setDiscount(request.getDiscount());
            order.setTotalPrice(totalPrice(request.getProductsFororder(), request.getDiscount()));
        }
        return order;
    }

    private Double totalPrice(List<ProductCountRequest> products) {
        double total = 0;
        for (ProductCountRequest product: products) {
            total += product.getQuantity()*productService.findOne(product.getProductId()).getPrice();
        }
        return total;
    }

    private Double totalPrice(List<ProductCountRequest> products, Integer discount) {
        double total = 0;
        for (ProductCountRequest product: products) {
            total += product.getQuantity()*productService.findOne(product.getProductId()).getPrice();
        }
        return total*(1 - (double)discount/100);
    }

    private void createProductCount(Order order, OrderRequest request) {
        productCountRepository.deleteAll(order.getProductCountList());
        List<ProductCount> productCounts = request.getProductsFororder().stream()
                .map(p -> productCountRequestToProductCount(order, p))
                .collect(Collectors.toList());
        productCountRepository.saveAll(productCounts);
    }

    private ProductCount productCountRequestToProductCount(Order order, ProductCountRequest request) {
        return ProductCount.builder()
                .product(productService.findOne(request.getProductId()))
                .quantity(request.getQuantity())
                .unitPrice(productService.findOne(request.getProductId()).getPrice())
                .order(order)
                .build();
    }
}
