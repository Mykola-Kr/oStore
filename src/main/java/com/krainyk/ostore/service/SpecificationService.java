package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.SpecificationRequest;
import com.krainyk.ostore.dto.respond.SpecificationRespond;
import com.krainyk.ostore.entity.Specification;
import com.krainyk.ostore.entity.Subcategory;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.SpecificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
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

    public void update(Long id, SpecificationRequest request) {
        specificationRepository.save(specificationRequestToSpecification(findOne(id), request));
    }

    public List<SpecificationRespond> findAll(Sort.Direction direction, String fieldName) {
        return specificationRepository.findAll(Sort.by(direction, fieldName)).stream().map(SpecificationRespond::new).collect(Collectors.toList());
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
