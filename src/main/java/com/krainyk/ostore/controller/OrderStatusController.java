package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.OrderStatusRequest;
import com.krainyk.ostore.dto.respond.OrderStatusRespond;
import com.krainyk.ostore.service.OrderStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("orderStatus")
public class OrderStatusController {

    @Autowired
    private OrderStatusService orderStatusService;

    @GetMapping
    public List<OrderStatusRespond> findAll(@RequestParam(defaultValue = "ASC")Sort.Direction direction,
                                            @RequestParam(defaultValue = "id") String fieldName) {
        return orderStatusService.findAll(direction, fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody OrderStatusRequest request) {
        orderStatusService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody OrderStatusRequest request, Long id) {
        orderStatusService.update(id, request);
    }

    @DeleteMapping
    public void delete(Long id) {
        orderStatusService.delet(id);
    }
}
