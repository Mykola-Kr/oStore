package com.krainyk.ostore.controller;

import com.krainyk.ostore.dto.request.CommentRequests;
import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.respond.CommentRespond;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@CrossOrigin
@RestController
@RequestMapping("comment")
public class CommentController {

    @Autowired
    private CommentService commentService;

    @GetMapping
    public PageRespond<CommentRespond> findPage(@Valid PaginationRequest request) {
        return commentService.findPage(request);
    }

    @GetMapping("/one/{id}")
    public CommentRespond findOne(@PathVariable Long id) {
        return commentService.findOneRespond(id);
    }

    @GetMapping("/byProduct")
    public PageRespond<CommentRespond> findAllByProductId(Long id, @Valid PaginationRequest request) {
        return commentService.findByProductId(id, request);
    }

    @GetMapping("/byProductAndIsAllowed")
    public PageRespond<CommentRespond> findAllByProductIdAndIsAllowed(Long id, Boolean isAllowed, @Valid PaginationRequest request) {
        return commentService.findByProductIdAndIsAllowed(id, isAllowed, request);
    }

    @PostMapping
    public void create(@Valid @RequestBody CommentRequests requests) {
        commentService.create(requests);
    }

    @PutMapping
    public void update(Long id, @Valid @RequestBody CommentRequests requests) {
        commentService.update(id, requests);
    }

    @DeleteMapping
    public void delete(Long id) {
        commentService.delete(id);
    }
 }
