package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.SubcategoryRequest;
import com.krainyk.ostore.dto.respond.SubcategoryRespond;
import com.krainyk.ostore.entity.Subcategory;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SubcategoryService {

    @Autowired
    private SubcategoryRepository subcategoryRepository;
    @Autowired
    private CategoryService categoryService;

    //changing request to entity
    private Subcategory subcategoryRequestToSubcategory(Subcategory subcategory, SubcategoryRequest request) {
        if (subcategory == null) {
            subcategory = new Subcategory();
        }
        subcategory.setName(request.getName());
        subcategory.setCategory(categoryService.findOne(request.getCategoryId()));
        return subcategory;
    }

    public void create(SubcategoryRequest request) {
        subcategoryRepository.save(subcategoryRequestToSubcategory(null, request));
    }

    public Subcategory findOne(Long id) {
        return subcategoryRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("Subcategory whit id " + id + " does not exist"));
    }

    public void update(Long id, SubcategoryRequest request) {
        subcategoryRepository.save(subcategoryRequestToSubcategory(findOne(id), request));
    }

    public void delete(Long id) {
        Subcategory subcategory = findOne(id);
        if (subcategory.getSpecifications().isEmpty() && subcategory.getProducts().isEmpty()) {
            subcategoryRepository.delete(subcategory);
        } else {
            throw new HasDependenciesException("Cannot delete subcategory with id " + id + " because it has dependencies");
        }
    }

    public List<SubcategoryRespond> findAll(Sort.Direction direction, String fieldName) {
        return subcategoryRepository.findAll(Sort.by(direction, fieldName))
                                    .stream()
                                    .map(SubcategoryRespond::new)
                                    .collect(Collectors.toList());
    }

    public SubcategoryRespond findOneRespond(Long id) {
        return new SubcategoryRespond(findOne(id));
    }
}
