package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.request.ProductCriteriaRequest;
import com.krainyk.ostore.dto.request.ProductRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.dto.respond.ProductForFullInfoRespond;
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
    public PageRespond<ProductRespond> findPage(@Valid PaginationRequest request) {
        return productService.findPage(request);
    }

    @GetMapping("/byName")
    public PageRespond<ProductRespond> findByNameLike(String value, @Valid PaginationRequest request) {
        return productService.findByNameLike(value, request);
    }

    @GetMapping("byCriteria")
    public PageRespond<ProductRespond> findByCriteria(ProductCriteriaRequest request, @Valid PaginationRequest paginationRequest) {
        return productService.findByCriteria(request, paginationRequest);
    }

    @GetMapping("/one/{id}")
    public ProductRespond findOne(@PathVariable Long id) {
        return productService.findOneRespond(id);
    }

    @GetMapping("/oneFullInfo/{id}")
    public ProductForFullInfoRespond findOneFullInfo(@PathVariable Long id) {
        return productService.findOneFullInfo(id);
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
