package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.ProductLabelRequest;
import com.krainyk.ostore.dto.respond.ProductLabelRespond;
import com.krainyk.ostore.service.ProductLabelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("productLabel")
public class ProductLabelController {

    @Autowired
    private ProductLabelService productLabelService;

    @GetMapping
    public List<ProductLabelRespond> findAll(@RequestParam(defaultValue = "id") String fieldName) {
        return productLabelService.findAll(fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody ProductLabelRequest request) {
        productLabelService.create(request);
    }

    @DeleteMapping
    public void delete(Long id) {
        productLabelService.delete(id);
    }

    @PutMapping
    public void update(@Valid @RequestBody ProductLabelRequest request, Long id) {
        productLabelService.update(request, id);
    }
}
