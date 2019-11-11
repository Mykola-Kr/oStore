package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.Specification;
import com.krainyk.ostore.entity.SpecificationValue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpecificationValueRepository extends JpaRepository<SpecificationValue, Long> {

    Page<SpecificationValue> findAllByValueLike (String value, Pageable pageable);

    Page<SpecificationValue> findAllBySpecification_Id(Long id, Pageable pageable);
}
