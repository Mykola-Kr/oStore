package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.CommentRequests;
import com.krainyk.ostore.dto.request.PaginationRequest;
import com.krainyk.ostore.dto.respond.CommentRespond;
import com.krainyk.ostore.dto.respond.PageRespond;
import com.krainyk.ostore.entity.Comment;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private ProductService productService;
    @Autowired
    private UserService userService;

    public CommentRespond findOneRespond(Long id) {
        return new CommentRespond(findOne(id));
    }

    public PageRespond<CommentRespond> findPage(PaginationRequest request) {
        Page<Comment> data = commentRepository.findAll(request.toPageable());
        return pageToPageRespond(data);
    }

    private PageRespond<CommentRespond> pageToPageRespond(Page<Comment> data) {
        List<CommentRespond> respondList = data.get().map(CommentRespond::new).collect(Collectors.toList());
        return new PageRespond<>(data.getTotalElements(), data.getTotalPages(), respondList);
    }

    public void create(CommentRequests requests) {
        commentRepository.save(commentRequestToComment(null, requests));
    }

    public void update(Long id, CommentRequests requests) {
        commentRepository.save(commentRequestToComment(findOne(id), requests));
        productService.createRating(requests.getProductId());
    }

    public Comment findOne(Long id) {
        return commentRepository.findById(id).orElseThrow(() -> new NoMatchesException("Comment with id " + id + " does not exist."));
    }

    private Comment commentRequestToComment(Comment comment, CommentRequests requests) {
        if (comment == null) {
            comment = new Comment();
            comment.setDateTime(LocalDateTime.now(ZoneId.of("Europe/Kiev")));
            comment.setIsAllowed(false);
        }
        comment.setDescription(requests.getDescription());
        comment.setMark(requests.getMark());
        if (requests.getIsAllowed() != null) {
            comment.setIsAllowed(requests.getIsAllowed());
        }
        comment.setProduct(productService.findOne(requests.getProductId()));
        comment.setUser(userService.findOne(requests.getUserId()));
        return comment;
    }

    public void delete(Long id) {
        commentRepository.delete(findOne(id));
    }
}
