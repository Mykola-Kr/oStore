package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.CategoryRequest;
import com.krainyk.ostore.dto.respond.CategoryRespond;
import com.krainyk.ostore.entity.Category;
import com.krainyk.ostore.exceptions.HasDependenciesException;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    // changing request to entity for using in update, create methods
    private Category categoryRequestToCategory(Category category, CategoryRequest request) {
        if (category == null) {
            category = new Category();
        }
        category.setName(request.getName());
        return category;
    }

    public void create (CategoryRequest request) {
        categoryRepository.save(categoryRequestToCategory(null, request));
    }

    // method for finding one category by it's id for using in update, delete methods. It throws exception if
    // category with such id doesn't exist
    public Category findOne(Long id) {
        return categoryRepository.findById(id).orElseThrow(() -> new NoMatchesException("Category with id " + id
                + " doesn't exist"));
    }

    public void update (CategoryRequest request, Long id) {
        categoryRepository.save(categoryRequestToCategory(findOne(id), request));
    }

    public void delete(Long id) {
        Category category = findOne(id);
        if (category.getSubcategories().isEmpty()) {
            categoryRepository.delete(category);
        }
        else throw new HasDependenciesException("Cannot delete category with id " + id + " because it has dependencies");
    }

    // method for finding all categories, changing them in CategoryRespond
    public List<CategoryRespond> findAll(Sort.Direction direction, String fieldName) {
        return categoryRepository.findAll(Sort.by(direction, fieldName)).stream().map(CategoryRespond::new).collect(Collectors.toList());
    }

    public CategoryRespond findOneRespond(Long id) {
        return new CategoryRespond(findOne(id));
    }

}
