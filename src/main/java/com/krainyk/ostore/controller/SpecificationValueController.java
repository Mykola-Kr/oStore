package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.SpecificationValueRequest;
import com.krainyk.ostore.dto.respond.SpecificationValueRespond;
import com.krainyk.ostore.service.SpecificationValueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("specificationValue")
public class SpecificationValueController {

    @Autowired
    private SpecificationValueService specificationValueService;

    @GetMapping
    public List<SpecificationValueRespond> findAll(@RequestParam(defaultValue = "ASC") Sort.Direction direction,
                                                   @RequestParam (defaultValue = "id") String fieldName) {
        return specificationValueService.findAll(direction, fieldName);
    }

    @PostMapping
    public void create(@Valid @RequestBody SpecificationValueRequest request) {
        specificationValueService.create(request);
    }

    @PutMapping
    public void update(@RequestBody SpecificationValueRequest request, Long id) {
        specificationValueService.update(request, id);
    }

    @DeleteMapping
    public void delete(Long id) {
        specificationValueService.delete(id);
    }

}
