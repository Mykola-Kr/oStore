package com.krainyk.ostore.specification;

import com.krainyk.ostore.dto.request.ProductCriteriaRequest;
import com.krainyk.ostore.entity.Category;
import com.krainyk.ostore.entity.Product;
import com.krainyk.ostore.entity.ProductLabel;
import com.krainyk.ostore.entity.Subcategory;
import org.springframework.data.jpa.domain.Specification;
import javax.persistence.criteria.*;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecification implements Specification<Product> {

    private String name;
    private Double minPrice;
    private Double maxPrice;
    private Long categoryId;
    private Long subcategoryId;
    private Long productLabelId;
    private Integer minQuantity;
    private Integer maxQuantity;
    private List<Long> specificationValuesIds;

    public ProductSpecification(ProductCriteriaRequest request) {
        this.name = request.getName();
        this.minPrice = request.getMinPrice();
        this.maxPrice = request.getMaxPrice();
        this.categoryId = request.getCategoryId();
        this.subcategoryId = request.getSubcategoryId();
        this.productLabelId = request.getProductLabelId();
        this.minQuantity = request.getMinQuantity();
        this.maxQuantity = request.getMaxQuantity();
        this.specificationValuesIds = request.getSpecificationValuesIds();
    }
    @Override
    public Predicate toPredicate(Root<Product> root, CriteriaQuery<?> cq, CriteriaBuilder cb) {
        cq.distinct(true);
        final List<Predicate> predicates = new ArrayList<>();
        predicates.add(findByNameLike(root, cb));
        predicates.add(findByPrice(root, cb));
        predicates.add(findByCategoryAndSubcategory(root, cb));
        predicates.add(finbByProductLabel(root, cb));
        predicates.add(findByQuantity(root, cb));
        return cb.and(predicates.toArray(new Predicate[0]));
    }

    private Predicate findByQuantity(Root<Product> root, CriteriaBuilder cb) {
        if (minQuantity != null && maxQuantity != null) {
            return cb.between(root.get("quantity"), minQuantity, maxQuantity);
        } else if (minQuantity != null) {
            return cb.ge(root.get("quantity"), minQuantity);
        } else if (maxQuantity != null) {
            return cb.le(root.get("quantity"), maxQuantity);
        } else {
            return cb.conjunction();
        }
    }

    private Predicate finbByProductLabel(Root<Product> root, CriteriaBuilder cb) {
        if (productLabelId == null) {
            return cb.conjunction();
        } else {
            Join<Product, ProductLabel> productLabelJoin = root.join("label");
            return cb.equal(productLabelJoin.get("id"), productLabelId);
        }
    }

    private Predicate findByCategoryAndSubcategory(Root<Product> root, CriteriaBuilder cb) {
        if (subcategoryId != null) {
            Join<Product, Subcategory> subcategoryJoin = root.join("subcategory");
            return cb.equal(subcategoryJoin.get("id"), subcategoryId);
        } else if (categoryId != null) {
            Join<Product, Subcategory> subcategoryJoin = root.join("subcategory");
            Join<Subcategory, Category> categoryJoin = subcategoryJoin.join("category");
            return cb.equal(categoryJoin.get("id"), categoryId);
        } else {
            return cb.conjunction();
        }
    }

    private Predicate findByPrice(Root<Product> root, CriteriaBuilder cb) {
        if (minPrice != null && maxPrice != null) {
            return cb.between(root.get("price"), minPrice, maxPrice);
        } else if (minPrice != null) {
            return cb.ge(root.get("price"), minPrice);
        } else if (maxPrice != null) {
            return cb.le(root.get("price"), maxPrice);
        } else {
            return cb.conjunction();
        }
    }

    private Predicate findByNameLike(Root<Product> root, CriteriaBuilder cb) {
        if (name == null || name.isEmpty()) {
            return cb.conjunction();
        } else {
            return cb.like(root.get("name"), "%" + name + "%");
        }
    }
}
