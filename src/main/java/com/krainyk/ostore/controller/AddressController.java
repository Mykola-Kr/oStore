package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.AddressRequest;
import com.krainyk.ostore.dto.respond.AddressRespond;
import com.krainyk.ostore.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("address")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @GetMapping
    public List<AddressRespond> findAll(@RequestParam(defaultValue = "ASC") Sort.Direction direction,
                                        @RequestParam(defaultValue = "id") String fieldName) {
        return addressService.findAll(direction, fieldName);
    }

    @PostMapping
    public  void create(@Valid @RequestBody AddressRequest request) {
        addressService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody AddressRequest request, Long id) {
        addressService.update(id, request);
    }

    @DeleteMapping
    public void delete(Long id) {
        addressService.delete(id);
    }
}
