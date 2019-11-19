package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.ProductCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductCountRepository extends JpaRepository<ProductCount, Long> {
}
