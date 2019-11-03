package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.ProductRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.dto.respond.ProductRespond;
import com.krainyk.ostore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.io.IOException;

@CrossOrigin
@RestController
@RequestMapping("product")
public class ProductController {

    @Autowired
    private ProductService productService;

    @PostMapping
    public void create(@Valid @RequestBody ProductRequest request) throws IOException {
        productService.create(request);
    }

    @GetMapping
    public PageRespond<ProductRespond> findPage(
            @RequestParam Integer page,
            @RequestParam Integer size,
            @RequestParam(defaultValue = "name") String fieldName,
            @RequestParam(defaultValue = "ASC") Sort.Direction direction) {
        return productService.findPage(page, size, fieldName, direction);
    }

    @GetMapping("/one/{id}")
    public ProductRespond findOne(@PathVariable Long id) {
        return productService.findOneResponce(id);
    }

    @PutMapping
    public void update(@Valid @RequestBody ProductRequest request, Long id) throws IOException {
        productService.update(request, id);
    }

    @DeleteMapping
    public void delete(Long id) {
        productService.delete(id);
    }
}
