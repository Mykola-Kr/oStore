package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.SpecificationValueRequest;
import com.krainyk.ostore.dto.respond.SpecificationValueRespond;
import com.krainyk.ostore.entity.SpecificationValue;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.SpecificationValueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SpecificationValueService {

    @Autowired
    private SpecificationValueRepository specificationValueRepository;
    @Autowired
    private SpecificationService specificationService;

    public SpecificationValue specificationValueRequestToSpecificationValue(SpecificationValue specificationValue,
                                                                            SpecificationValueRequest request) {
        if (specificationValue == null) {
            specificationValue = new SpecificationValue();
        }
        specificationValue.setValue(request.getValue());
        specificationValue.setSpecification(specificationService.findOne(request.getSpecificationId()));
        return specificationValue;
    }

    public void create(SpecificationValueRequest request) {
        specificationValueRepository.save(specificationValueRequestToSpecificationValue(null, request));
    }

    public void update(SpecificationValueRequest request, Long id) {
        specificationValueRepository.save(specificationValueRequestToSpecificationValue(findOne(id), request));
    }

    public SpecificationValue findOne(Long id) {
        return specificationValueRepository.findById(id).orElseThrow(() -> new NoMatchesException("SpecificationValue with id "
                + id + " does not exist"));
    }

    public List<SpecificationValueRespond> findAll(Sort.Direction direction, String fieldName) {
        return specificationValueRepository.findAll(Sort.by(direction, fieldName)).stream()
                .map(SpecificationValueRespond::new).collect(Collectors.toList());
    }

    public void delete(Long id) {
        SpecificationValue specificationValue = findOne(id);
        if (specificationValue.getProducts().isEmpty()) {
            specificationValueRepository.delete(specificationValue);
        } else {
            throw new HasDependenciesException("Cannot delete specificationValue with id " + id + " because it has dependencies");
        }
    }
}
