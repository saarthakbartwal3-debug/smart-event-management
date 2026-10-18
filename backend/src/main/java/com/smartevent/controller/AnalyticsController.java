package com.smartevent.controller;

import com.smartevent.service.AnalyticsService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

    @GetMapping("/dashboard")
    public Map<String, Object> dashboard() {
        return analyticsService.dashboard();
    }
}
