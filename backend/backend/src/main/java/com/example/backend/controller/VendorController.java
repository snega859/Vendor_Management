package com.example.backend.controller;

import com.example.backend.entity.Vendor;
import com.example.backend.service.VendorService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "http://localhost:5173")
public class VendorController {

    private final VendorService service;

    public VendorController(VendorService service) {
        this.service = service;
    }

    // Register
    @PostMapping("/register")
    public Vendor register(
            @RequestBody Vendor vendor) {

        return service.registerVendor(vendor);
    }

    // Get all
    @GetMapping
    public List<Vendor> getAll() {

        return service.getAllVendors();
    }

    // Get one
    @GetMapping("/{id}")
    public Vendor getOne(
            @PathVariable Long id) {

        return service.getVendorById(id);
    }

    // Update
    @PutMapping("/{id}")
    public Vendor update(
            @PathVariable Long id,
            @RequestBody Vendor vendor) {

        return service.updateVendor(id, vendor);
    }

    // Delete
    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        service.deleteVendor(id);

        return "Vendor deleted successfully";
    }
}