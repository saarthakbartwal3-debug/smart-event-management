package com.smartevent.controller;

import com.smartevent.service.AuthService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;
    public AuthController(AuthService authService) { this.authService = authService; }

    public record RegisterRequest(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Email @Size(max = 190) String email,
            @NotBlank @Size(min = 8, max = 72) String password) {}
    public record LoginRequest(@NotBlank @Email String email, @NotBlank String password) {}

    @PostMapping("/register")
    public Map<String, Object> register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request.name(), request.email(), request.password());
    }

    @PostMapping("/login")
    public Map<String, Object> login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request.email(), request.password());
    }
}
