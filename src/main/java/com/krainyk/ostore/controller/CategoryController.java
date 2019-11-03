package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.CategoryRequest;
import com.krainyk.ostore.dto.respond.CategoryRespond;
import com.krainyk.ostore.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryRespond> findAll(@RequestParam(defaultValue = "ASC")Sort.Direction direction,
                                         @RequestParam(defaultValue = "id") String fieldName) {
        return categoryService.findAll(direction, fieldName);
    }

    @GetMapping("/one/{id}")
    public CategoryRespond findOne(@PathVariable Long id) {
        return categoryService.findOneRespond(id);
    }

    @PostMapping
    public void create(@Valid @RequestBody CategoryRequest request) {
        categoryService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody CategoryRequest request, Long id) {
        categoryService.update(request, id);
    }

    @DeleteMapping
    public void delete(Long id) {
        categoryService.delete(id);
    }
}
