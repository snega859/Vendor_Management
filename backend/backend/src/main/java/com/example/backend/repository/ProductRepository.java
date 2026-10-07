package com.example.backend.repository;

import com.example.backend.entity.Product;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository
        extends JpaRepository<Product, Long> {

    @Modifying
    @Query("""
        UPDATE Product p
        SET p.quantity = p.quantity - p.requestedQuantity,
            p.requestStatus = 'APPROVED'
        WHERE p.id = :id
        AND p.requestStatus = 'PENDING'
        AND p.requestedQuantity <= p.quantity
    """)
    int confirmRequest(@Param("id") Long id);


    @Modifying
    @Query("""
        UPDATE Product p
        SET p.requestStatus = 'REJECTED'
        WHERE p.id = :id
        AND p.requestStatus = 'PENDING'
    """)
    int rejectRequest(@Param("id") Long id);
}