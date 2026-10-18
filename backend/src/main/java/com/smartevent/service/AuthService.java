package com.smartevent.service;

import com.smartevent.entity.Role;
import com.smartevent.entity.User;
import com.smartevent.repository.UserRepository;
import com.smartevent.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwtService) {
        this.users = users;
        this.encoder = encoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public Map<String, Object> register(String name, String email, String password) {
        String normalizedEmail = email.trim().toLowerCase();
        if (users.existsByEmailIgnoreCase(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email is already registered.");
        }
        User user = new User();
        user.setName(name.trim());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(encoder.encode(password));
        user.setRole(Role.STUDENT); // Public registration can never create an administrator.
        user = users.save(user);
        return response(user);
    }

    public Map<String, Object> login(String email, String password) {
        User user = users.findByEmailIgnoreCase(email.trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!encoder.matches(password, user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        }
        return response(user);
    }

    private Map<String, Object> response(User user) {
        return Map.of(
                "token", jwtService.generateToken(user),
                "user", Map.of("id", user.getId(), "name", user.getName(),
                        "email", user.getEmail(), "role", user.getRole().name()));
    }
}
