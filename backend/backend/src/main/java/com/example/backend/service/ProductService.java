package com.example.backend.service;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    // ==================================================
    // ADD PRODUCT
    // ==================================================

    public Product addProduct(Product product) {

        product.setRequestStatus("NONE");
        product.setRequestedQuantity(0);
        product.setRequestedBy(null);

        product.setQuotationStatus("NONE");
        product.setSupplierName(null);
        product.setQuotationTotal(0.0);

        return repository.save(product);
    }

    // ==================================================
    // GET ALL PRODUCTS
    // ==================================================

    public List<Product> getAllProducts() {

        return repository.findAll();
    }

    // ==================================================
    // GET ONE PRODUCT
    // ==================================================

    public Product getProduct(Long id) {

        return repository
                .findById(id)
                .orElse(null);
    }

    // ==================================================
    // UPDATE PRODUCT
    // ==================================================

    public Product updateProduct(
            Long id,
            Product product) {

        Product existing =
                repository
                        .findById(id)
                        .orElse(null);

        if (existing == null) {

            return null;
        }

        existing.setProductName(
                product.getProductName()
        );

        existing.setPrice(
                product.getPrice()
        );

        existing.setQuantity(
                product.getQuantity()
        );

        return repository.save(existing);
    }

    // ==================================================
    // SAVE PRODUCT
    // ==================================================

    public Product saveProduct(Product product) {

        return repository.save(product);
    }

    // ==================================================
    // DELETE PRODUCT
    // ==================================================

    public void deleteProduct(Long id) {

        repository.deleteById(id);
    }

    // ==================================================
    // CONFIRM PURCHASE REQUEST
    // ==================================================

    @Transactional
    public Product confirmRequest(Long id) {

        Product product =
                repository
                        .findById(id)
                        .orElse(null);

        if (product == null) {

            throw new RuntimeException(
                    "Product not found"
            );
        }

        if (!"PENDING".equals(
                product.getRequestStatus())) {

            throw new RuntimeException(
                    "Request is not pending"
            );
        }

        product.setRequestStatus(
                "CONFIRMED"
        );

        return repository.save(product);
    }

    // ==================================================
    // REJECT PURCHASE REQUEST
    // ==================================================

    @Transactional
    public Product rejectRequest(Long id) {

        Product product =
                repository
                        .findById(id)
                        .orElse(null);

        if (product == null) {

            throw new RuntimeException(
                    "Product not found"
            );
        }

        if (!"PENDING".equals(
                product.getRequestStatus())) {

            throw new RuntimeException(
                    "Request is not pending"
            );
        }

        product.setRequestStatus(
                "REJECTED"
        );

        return repository.save(product);
    }

    // ==================================================
    // CONFIRM QUOTATION
    // ==================================================

    @Transactional
    public Product confirmQuotation(
            Long id,
            String supplierName) {

        Product product =
                repository
                        .findById(id)
                        .orElse(null);

        // Product check
        if (product == null) {

            throw new RuntimeException(
                    "Product not found"
            );
        }

        // Quantity check
        if (product.getRequestedQuantity() <= 0) {

            throw new RuntimeException(
                    "No requested quantity found"
            );
        }

        // Supplier check
        if (supplierName == null ||
                supplierName.trim().isEmpty()) {

            throw new RuntimeException(
                    "Supplier is required"
            );
        }

        // Calculate total
        double totalAmount =
                product.getPrice()
                        *
                product.getRequestedQuantity();

        // ==================================================
        // SAVE QUOTATION DETAILS
        // ==================================================

        product.setSupplierName(
                supplierName
        );

        product.setQuotationTotal(
                totalAmount
        );

        product.setQuotationStatus(
                "CONFIRMED"
        );

        // ==================================================
        // IMPORTANT
        // REQUEST ALSO BECOMES CONFIRMED
        // ==================================================

        product.setRequestStatus(
                "CONFIRMED"
        );

        // ==================================================
        // SAVE
        // ==================================================

        return repository.save(product);
    }
}