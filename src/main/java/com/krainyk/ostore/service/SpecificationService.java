package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.SpecificationRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.dto.respond.SpecificationRespond;
import com.krainyk.ostore.entity.Specification;
import com.krainyk.ostore.entity.Subcategory;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.SpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecificationService {

    @Autowired
    private SpecificationRepository specificationRepository;
    @Autowired
    private SubcategoryService subcategoryService;


    private Specification specificationRequestToSpecification(Specification specification,
                                                              SpecificationRequest request) {
        if (specification == null) {
            specification = new Specification();
        }
        specification.setName(request.getName());
        if (request.getSubcategoriesIds() != null) {
            List<Subcategory> subcategories = request.getSubcategoriesIds().stream()
                    .map(subcategoryService::findOne).collect(Collectors.toList());
            specification.setSubcategories(subcategories);
        }
        return specification;
    }

    public void create(SpecificationRequest request) {
        specificationRepository.save(specificationRequestToSpecification(null, request));
    }

    public Specification findOne(Long id) {
        return specificationRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("Specification with id " + id + " does not exist"));
    }

    public SpecificationRespond findOneRespond(Long id) {
        return new SpecificationRespond(findOne(id));
    }

    public void update(Long id, SpecificationRequest request) {
        specificationRepository.save(specificationRequestToSpecification(findOne(id), request));
    }

    public List<SpecificationRespond> findAll(Sort.Direction direction, String fieldName) {
        return specificationRepository.findAll(Sort.by(direction, fieldName)).stream().map(SpecificationRespond::new).collect(Collectors.toList());
    }

    // getting PageRespond from Page for using in all findPages methods
    private PageRespond<SpecificationRespond> pageToPageRespond(Page<Specification> data) {
        List<SpecificationRespond> respondList = data.get().map(SpecificationRespond::new).collect(Collectors.toList());
        return new PageRespond<>(data.getTotalElements(), data.getTotalPages(), respondList);
    }

    public PageRespond<SpecificationRespond> findSpecificationPage(Integer page, Integer size, Sort.Direction direction, String fieldName) {
        Page<Specification> data = specificationRepository.findAll(PageRequest.of(page, size, direction, fieldName));
        return pageToPageRespond(data);
    }

    public PageRespond<SpecificationRespond> findAllByName(
            String value, Integer page, Integer size, Sort.Direction direction, String fieldName) {
        Page<Specification> data = specificationRepository.findAllByNameLike('%' + value + '%',
                PageRequest.of(page, size, direction, fieldName));
        return pageToPageRespond(data);
    }

    public List<SpecificationRespond> findAllBySubcategoryId(Long id) {
        return subcategoryService.findOne(id).getSpecifications().stream().map(SpecificationRespond::new).collect(Collectors.toList());
    }

    public void delete(Long id) {
        Specification specification = findOne(id);
        if (specification.getSpecificationValues().isEmpty() && specification.getSubcategories().isEmpty()) {
            specificationRepository.delete(specification);
        } else {
            throw new HasDependenciesException("Cannot delete specification with id " + id + " because it has dependencies");
        }
    }
}
