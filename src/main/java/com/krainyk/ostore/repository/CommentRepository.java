package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findAllByProductId(Long id, Pageable pageable);
    Page<Comment> findAllByProductIdAndIsAllowed(Long id, Boolean isAllowed, Pageable pageable);
}
