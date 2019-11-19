package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.request.ProductCriteriaRequest;
import com.krainyk.ostore.dto.request.ProductRequest;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.dto.respond.ProductForFullInfoRespond;
import com.krainyk.ostore.dto.respond.ProductRespond;
import com.krainyk.ostore.entity.Comment;
import com.krainyk.ostore.entity.Product;
import com.krainyk.ostore.entity.SpecificationValue;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.ProductRepository;
import com.krainyk.ostore.specification.ProductSpecification;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SubcategoryService subcategoryService;
    @Autowired
    private ProductLabelService productLabelService;
    @Autowired
    private SpecificationValueService specificationValueService;
    @Autowired
    private FileService fileService;


    private Product productRequestToProduct(Product product, ProductRequest request) throws IOException {
        if (product == null) {
            product = new Product();
        }
        if (request.getImg() != null && !request.getImg().isEmpty()) {
            product.setImg(fileService.saveFile(request.getImg()));
        }
        product.setName(request.getName());
        product.setPrice(request.getPrice());
        product.setDescription(request.getDescription());
        product.setQuantity(request.getQuantity());
        product.setSubcategory(subcategoryService.findOne(request.getSubcategoryId()));
        product.setLabel(productLabelService.findOne(request.getProductLabelId()));
        if (request.getSpecificationsValuesIds() != null) {
            List<SpecificationValue> specificationValues = request.getSpecificationsValuesIds().stream()
                                    .map(specificationValueService::findOne).collect(Collectors.toList());
            product.setSpecificationValues(specificationValues);
        }
        return product;
    }

    public Product findOne(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new NoMatchesException("Product with id "
                + id + " does not exist"));
    }

    public void create(ProductRequest request) throws IOException {
        productRepository.save(productRequestToProduct(null, request));
    }

    public void update(ProductRequest request, Long id) throws IOException {
        productRepository.save(productRequestToProduct(findOne(id), request));
    }

    public void delete(Long id) {
        Product product = findOne(id);
        if (product.getImg() != null) {
            File photo = new File(FileService.IMG_DIR + product.getImg());
            photo.delete();
        }
        productRepository.delete(product);
    }

    public List<ProductRespond> findAll() {
        return productRepository.findAll().stream().map(ProductRespond::new).collect(Collectors.toList());
    }
    // changes Page to PageRespond
    private PageRespond<ProductRespond> pageToPageRespond(Page<Product> data) {
        List<ProductRespond> respondList = data.get().map(ProductRespond::new).collect(Collectors.toList());
        return new PageRespond<>(data.getTotalElements(), data.getTotalPages(), respondList);
    }

    public PageRespond<ProductRespond> findPage(PaginationRequest request) {
        Page<Product> data = productRepository.findAll(request.toPageable());
        return pageToPageRespond(data);
    }

    public PageRespond<ProductRespond> findByNameLike(String value, PaginationRequest request) {
        Page<Product> data = productRepository.findAllByNameLike('%' + value + '%', request.toPageable());
        return pageToPageRespond(data);
    }

    public PageRespond<ProductRespond> findByCriteria(ProductCriteriaRequest request, PaginationRequest paginationRequest) {
        Page<Product> data = productRepository.findAll(new ProductSpecification(request), paginationRequest.toPageable());
        return pageToPageRespond(data);
    }

    // setting rating for product after creating comment
    public void createRating(Long id) {
        List<Integer> marks = findOne(id).getComments().stream().filter(p -> p.getIsAllowed()).map(Comment::getMark).collect(Collectors.toList());
        Integer sum = 0;
        for (Integer mark: marks) {
            sum += mark;
        }
        findOne(id).setRating((double) sum/marks.size());
        productRepository.save(findOne(id));
    }

    public ProductRespond findOneRespond(Long id) {
        return new ProductRespond(findOne(id));
    }

    public ProductForFullInfoRespond findOneFullInfo(Long id) {
        return new ProductForFullInfoRespond(findOne(id));
    }
}
