package com.example.backend.controller;

import com.example.backend.entity.Supplier;
import com.example.backend.service.SupplierService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "http://localhost:5173")
public class SupplierController {

    private final SupplierService service;

    public SupplierController(SupplierService service) {
        this.service = service;
    }

    @PostMapping
    public Supplier add(
            @RequestBody Supplier supplier) {

        return service.addSupplier(supplier);
    }

    @GetMapping
    public List<Supplier> getAll() {

        return service.getAllSuppliers();
    }

    @GetMapping("/{id}")
    public Supplier getOne(
            @PathVariable Long id) {

        return service.getSupplier(id);
    }

    @PutMapping("/{id}")
    public Supplier update(
            @PathVariable Long id,
            @RequestBody Supplier supplier) {

        return service.updateSupplier(id, supplier);
    }

    @DeleteMapping("/{id}")
    public String delete(
            @PathVariable Long id) {

        service.deleteSupplier(id);

        return "Supplier deleted successfully";
    }
}