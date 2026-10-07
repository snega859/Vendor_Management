package com.example.backend.service;

import com.example.backend.entity.Supplier;
import com.example.backend.repository.SupplierRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository repository;

    public SupplierService(SupplierRepository repository) {
        this.repository = repository;
    }

    public Supplier addSupplier(Supplier supplier) {

        return repository.save(supplier);
    }

    public List<Supplier> getAllSuppliers() {

        return repository.findAll();
    }

    public Supplier getSupplier(Long id) {

        return repository.findById(id).orElse(null);
    }

    public Supplier updateSupplier(
            Long id,
            Supplier supplier) {

        Supplier existing =
                repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setSupplierName(
                supplier.getSupplierName());

        existing.setCompanyName(
                supplier.getCompanyName());

        existing.setEmail(
                supplier.getEmail());

        existing.setPhone(
                supplier.getPhone());

        existing.setAddress(
                supplier.getAddress());

        return repository.save(existing);
    }

    public void deleteSupplier(Long id) {

        repository.deleteById(id);
    }
}