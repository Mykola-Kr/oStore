package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.DeliveryRequest;
import com.krainyk.ostore.dto.respond.DeliveryRespond;
import com.krainyk.ostore.service.DeliveryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @GetMapping
    public List<DeliveryRespond> findAll(@RequestParam(defaultValue = "ASC")Sort.Direction direction,
                                         @RequestParam(defaultValue = "id") String fieldName) {
        return deliveryService.findAll(direction, fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody DeliveryRequest request) {
        deliveryService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody DeliveryRequest request, Long id) {
        deliveryService.update(id, request);
    }

    @DeleteMapping
    public void delete(Long id) {
        deliveryService.delete(id);
    }
}
