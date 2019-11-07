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
}
