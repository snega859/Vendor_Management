package com.example.backend.controller;

import com.example.backend.entity.Vendor;
import com.example.backend.service.AuthService;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, String> login(
            @RequestBody Map<String, String> data) {

        String username = data.get("username");
        String password = data.get("password");

        Vendor vendor =
                authService.login(username, password);

        Map<String, String> response =
                new HashMap<>();

        if (vendor != null) {

            response.put(
                    "username",
                    vendor.getUsername());

            response.put("role", "VENDOR");

            response.put(
                    "message",
                    "Login successful");

        } else {

            response.put(
                    "role",
                    "INVALID");

            response.put(
                    "message",
                    "Invalid username or password");
        }

        return response;
    }
}