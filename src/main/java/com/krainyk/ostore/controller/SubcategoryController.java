package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.request.SubcategoryRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
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

    @GetMapping("/byIds/{ids}")
    public List<SubcategoryRespond> findAllByListIds(@PathVariable List<Long> ids) {
        return subcategoryService.findAllByIds(ids);
    }

//    @GetMapping("/pages")
//    public PageRespond<SubcategoryRespond> findPage(
//            @RequestParam Integer page,
//            @RequestParam Integer size,
//            @RequestParam(defaultValue = "ASC") Sort.Direction direction,
//            @RequestParam(defaultValue = "name") String fieldName) {
//        return subcategoryService.findSubcategoryPage(page, size, direction, fieldName);
//    }

    @GetMapping("/pages")
    public PageRespond<SubcategoryRespond> findPage(@Valid PaginationRequest request) {
        return subcategoryService.findSubcategoryPage(request);
    }

    @GetMapping("/byCategoryId/{id}")
    public PageRespond<SubcategoryRespond> findAllByCategoryId(@PathVariable Long id, @Valid PaginationRequest request) {
        return subcategoryService.findAllByCategoryId(id, request);
    }

    @GetMapping("/byName")
    public PageRespond<SubcategoryRespond> findAllByNameLike(String value, @Valid PaginationRequest request) {
        return subcategoryService.findAllByName(value, request);
    }

    @GetMapping("/one/{id}")
    public SubcategoryRespond findOne(@PathVariable Long id) {
        return subcategoryService.findOneRespond(id);
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
