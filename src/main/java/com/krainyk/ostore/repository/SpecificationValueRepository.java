package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.SpecificationValue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpecificationValueRepository extends JpaRepository<SpecificationValue, Long> {
}
