package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.ProductLabelRequest;
import com.krainyk.ostore.dto.respond.ProductLabelRespond;
import com.krainyk.ostore.entity.ProductLabel;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.ProductLabelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductLabelService {

    @Autowired
    private ProductLabelRepository productLabelRepository;

    public ProductLabel productLabelRequestToProductLabel(ProductLabel productLabel, ProductLabelRequest request) {
        if (productLabel == null) {
            productLabel = new ProductLabel();
        }
        productLabel.setName(request.getName());
        return productLabel;
    }

    public void create (ProductLabelRequest request) {
        productLabelRepository.save(productLabelRequestToProductLabel(null, request));
    }

    public ProductLabel findOne(Long id) {
        return productLabelRepository.findById(id).orElseThrow(() -> new NoMatchesException("ProductLabel with id " + id + " does not exist"));
    }

    public void update(ProductLabelRequest request, Long id) {
        productLabelRepository.save(productLabelRequestToProductLabel(findOne(id), request));
    }

    public void delete(Long id) {
        ProductLabel productLabel = findOne(id);
        if (productLabel.getProducts().isEmpty()) {
            productLabelRepository.delete(productLabel);
        } else {
            throw new HasDependenciesException("Cannot delete productLabel with id " + id + " because it has dependencies");
        }
    }

    public List<ProductLabelRespond> findAll(String fieldName) {
        return productLabelRepository.findAll(Sort.by(fieldName)).stream().map(ProductLabelRespond::new).collect(Collectors.toList());
    }

}
