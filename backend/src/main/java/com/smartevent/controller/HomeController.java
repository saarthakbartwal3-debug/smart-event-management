package com.smartevent.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Smart Event Management System!";
    }

    @GetMapping("/api/status")
    public String status() {
        return "Backend is running and MySQL is connected!";
    }
}