package com.example.backend.service;

import com.example.backend.entity.Vendor;
import com.example.backend.repository.VendorRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VendorService {

    private final VendorRepository repository;

    public VendorService(VendorRepository repository) {
        this.repository = repository;
    }

    public Vendor registerVendor(Vendor vendor) {

        vendor.setStatus("ACTIVE");

        return repository.save(vendor);
    }

    public List<Vendor> getAllVendors() {

        return repository.findAll();
    }

    public Vendor getVendorById(Long id) {

        return repository.findById(id).orElse(null);
    }

    public Vendor updateVendor(
            Long id,
            Vendor vendor) {

        Vendor existing =
                repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setVendorName(
                vendor.getVendorName());

        existing.setCompanyName(
                vendor.getCompanyName());

        existing.setEmail(
                vendor.getEmail());

        existing.setPhone(
                vendor.getPhone());

        existing.setAddress(
                vendor.getAddress());

        existing.setUsername(
                vendor.getUsername());

        existing.setPassword(
                vendor.getPassword());

        existing.setStatus(
                vendor.getStatus());

        return repository.save(existing);
    }

    public void deleteVendor(Long id) {

        repository.deleteById(id);
    }
}