package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.SubcategoryRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.dto.respond.SubcategoryRespond;
import com.krainyk.ostore.entity.Subcategory;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.SubcategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    // getting PageRespond from Page for using in all findPages methods
    private PageRespond<SubcategoryRespond> pageToPageRespond(Page<Subcategory> data) {
        List<SubcategoryRespond> respondList = data.get().map(SubcategoryRespond::new).collect(Collectors.toList());
        return new PageRespond<>(data.getTotalElements(), data.getTotalPages(), respondList);
    }

    public PageRespond<SubcategoryRespond> findSubcategoryPage(Integer page, Integer size, Sort.Direction direction, String fieldName) {
        Page<Subcategory> data = subcategoryRepository.findAll(PageRequest.of(page, size, direction, fieldName));
        return pageToPageRespond(data);
    }

    public PageRespond<SubcategoryRespond> findAllByCategoryId(
            Long id, Integer page, Integer size, Sort.Direction direction, String fieldName) {
        Page<Subcategory> data = subcategoryRepository.findAllByCategory_Id(id, PageRequest.of(page, size, direction, fieldName));
        return pageToPageRespond(data);
    }

    public PageRespond<SubcategoryRespond> findAllByName(
            String value, Integer page, Integer size, Sort.Direction direction, String fieldName) {
        Page<Subcategory> data = subcategoryRepository.findAllByNameLike('%' + value + '%',
                                                            PageRequest.of(page, size, direction, fieldName));
        return pageToPageRespond(data);
    }

    public SubcategoryRespond findOneRespond(Long id) {
        return new SubcategoryRespond(findOne(id));
    }
}
