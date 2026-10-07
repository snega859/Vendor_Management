package com.example.backend.service;

import com.example.backend.entity.Vendor;
import com.example.backend.repository.VendorRepository;

import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final VendorRepository vendorRepository;

    public AuthService(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    public Vendor login(
            String username,
            String password) {

        Vendor vendor =
                vendorRepository
                        .findByUsername(username)
                        .orElse(null);

        if (vendor == null) {
            return null;
        }

        if (!vendor.getPassword().equals(password)) {
            return null;
        }

        if (!"ACTIVE".equals(vendor.getStatus())) {
            return null;
        }

        return vendor;
    }
}