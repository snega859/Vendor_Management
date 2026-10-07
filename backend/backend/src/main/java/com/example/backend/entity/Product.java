package com.example.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private double price;
    private int quantity;

    // Purchase Request
    private int requestedQuantity;
    private String requestedBy;
    private String requestStatus;

    // Quotation
    private String quotationStatus;
    private String supplierName;
    private double quotationTotal;

    public Product() {
    }

    public Product(String productName, double price, int quantity) {

        this.productName = productName;
        this.price = price;
        this.quantity = quantity;

        this.requestedQuantity = 0;
        this.requestedBy = null;
        this.requestStatus = "NONE";

        this.quotationStatus = "NONE";
        this.supplierName = null;
        this.quotationTotal = 0.0;
    }

    // ID
    public Long getId() {
        return id;
    }

    // Product Name
    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    // Price
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    // Quantity
    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    // Requested Quantity
    public int getRequestedQuantity() {
        return requestedQuantity;
    }

    public void setRequestedQuantity(int requestedQuantity) {
        this.requestedQuantity = requestedQuantity;
    }

    // Requested By
    public String getRequestedBy() {
        return requestedBy;
    }

    public void setRequestedBy(String requestedBy) {
        this.requestedBy = requestedBy;
    }

    // Request Status
    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    // Quotation Status
    public String getQuotationStatus() {
        return quotationStatus;
    }

    public void setQuotationStatus(String quotationStatus) {
        this.quotationStatus = quotationStatus;
    }

    // Supplier Name
    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    // Quotation Total
    public double getQuotationTotal() {
        return quotationTotal;
    }

    public void setQuotationTotal(double quotationTotal) {
        this.quotationTotal = quotationTotal;
    }
}