package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.OrderStatusRequest;
import com.krainyk.ostore.dto.respond.OrderStatusRespond;
import com.krainyk.ostore.entity.OrderStatus;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.OrderStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderStatusService {

    @Autowired
    private OrderStatusRepository orderStatusRepository;

    private OrderStatus orderStatusRequestToOrderStatus(OrderStatus orderStatus, OrderStatusRequest request) {
        if (orderStatus == null) {
            orderStatus = new OrderStatus();
        }
        orderStatus.setStatus(request.getStatus());
        return orderStatus;
    }

    public void create(OrderStatusRequest request) {
        orderStatusRepository.save(orderStatusRequestToOrderStatus(null, request));
    }

    public OrderStatus findOne(Long id) {
        return orderStatusRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("OrderStatus with id " + id + " does not exist."));
    }

    public void update(Long id, OrderStatusRequest request) {
        orderStatusRepository.save(orderStatusRequestToOrderStatus(findOne(id), request));
    }

    public void delet(Long id) {
        OrderStatus orderStatus = findOne(id);
        if (orderStatus.getOrders().isEmpty()) {
            orderStatusRepository.delete(orderStatus);
        } else {
            throw new HasDependenciesException("Cannot delete orderStatus with id " + id + " because it has dependencies");
        }
    }

    public List<OrderStatusRespond> findAll(Sort.Direction direction, String fieldName) {
        return orderStatusRepository.findAll(Sort.by(direction, fieldName))
                                    .stream()
                                    .map(OrderStatusRespond::new)
                                    .collect(Collectors.toList());
    }
}
