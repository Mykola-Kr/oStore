package com.krainyk.ostore.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HtmlPagesController {

    @RequestMapping("admin-category")
    public String category() {
        return "admin-category.html";
    }

    @RequestMapping("admin-subcategory")
    public String subcategory() {
        return "admin-subcategory.html";
    }

    @RequestMapping("admin-product-label")
    public String productLabel() {
        return "admin-product-label.html";
    }

    @RequestMapping("admin-delivery")
    public String delivery() {
        return "admin-delivery.html";
    }

    @RequestMapping("admin-specification")
    public String specification() {
        return "admin-specification.html";
    }

    @RequestMapping("admin-specification-value")
    public String specificationValue() {
        return "admin-specification-value.html";
    }

    @RequestMapping("admin-product")
    public String adminProduct() {
        return "admin-product.html";
    }
}
