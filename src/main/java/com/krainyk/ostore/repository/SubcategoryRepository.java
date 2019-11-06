package com.krainyk.ostore.repository;

import com.krainyk.ostore.entity.Subcategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubcategoryRepository extends JpaRepository<Subcategory, Long> {

    Page<Subcategory> findAllByCategory_Id(Long id, Pageable pageable);

    Page<Subcategory> findAllByNameLike(String value, Pageable pageable);
}
