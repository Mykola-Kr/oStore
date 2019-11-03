package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.SpecificationRequest;
import com.krainyk.ostore.dto.respond.SpecificationRespond;
import com.krainyk.ostore.service.SpecificationService;
import com.krainyk.ostore.service.SubcategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("specification")
public class SpecificationController {

    @Autowired
    private SpecificationService specificationService;

    @GetMapping
    public List<SpecificationRespond> findAll(@RequestParam(defaultValue = "ASC") Sort.Direction direction,
                                              @RequestParam(defaultValue = "id") String fieldName) {
        return specificationService.findAll(direction, fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody SpecificationRequest request) {
        specificationService.create(request);
    }

    @PutMapping
    public void update(@Valid @RequestBody SpecificationRequest request, Long id) {
        specificationService.update(id, request);
    }

    @DeleteMapping
    public void delete(Long id) {
        specificationService.delete(id);
    }
}
