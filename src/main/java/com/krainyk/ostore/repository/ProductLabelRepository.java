package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.ProductLabel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductLabelRepository extends JpaRepository<ProductLabel, Long> {

}
