package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.request.SpecificationValueRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
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

    @GetMapping("/pages")
    public PageRespond<SpecificationValueRespond> findAllPages(@Valid PaginationRequest request) {
        return specificationValueService.findSpecificationValuePage(request);
    }

    @GetMapping("/byName")
    public PageRespond<SpecificationValueRespond> findByNameLike(String value, @Valid PaginationRequest request) {
        return specificationValueService.findAllByNameLike(value, request);
    }

    @GetMapping("/bySpecificationId/{id}")
    public PageRespond<SpecificationValueRespond> findAllBySpecificationId(@PathVariable Long id, @Valid PaginationRequest request) {
        return specificationValueService.findAllBySpecificationId(id, request);
    }

    @GetMapping("/one/{id}")
    public SpecificationValueRespond findOne(@PathVariable Long id) {
        return specificationValueService.findOneRespond(id);
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
