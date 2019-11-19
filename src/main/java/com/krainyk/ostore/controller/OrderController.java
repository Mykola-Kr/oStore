package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.OrderRequest;
import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.respond.OrderRespond;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping()
    public PageRespond<OrderRespond> findPage(@Valid PaginationRequest request) {
        return orderService.findPage(request);
    }

    @GetMapping("/one/{id}")
    public OrderRespond findOne(@PathVariable Long id) {
        return orderService.findOneRespond(id);
    }

    @PostMapping
    public void create(@Valid @RequestBody OrderRequest request) {
        orderService.createOrder(request);
    }

    @PutMapping
    public void update(Long id, @RequestBody OrderRequest request) {
        orderService.update(id, request);
    }


}
