package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.SubcategoryRequest;
import com.krainyk.ostore.dto.respond.SubcategoryRespond;
import com.krainyk.ostore.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("subcategory")
public class SubcategoryController {

    @Autowired
    private SubcategoryService subcategoryService;

    @GetMapping
    public List<SubcategoryRespond> findAll(@RequestParam(defaultValue = "ASC")Sort.Direction direction,
                                            @RequestParam(defaultValue = "id") String fieldName) {
        return subcategoryService.findAll(direction, fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody SubcategoryRequest request) {
        subcategoryService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody SubcategoryRequest request, Long id) {
        subcategoryService.update(id, request);
    }

    @DeleteMapping
    public void delete(Long id) {
        subcategoryService.delete(id);
    }
}
