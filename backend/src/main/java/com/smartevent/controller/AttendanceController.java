package com.smartevent.controller;

import com.smartevent.entity.Attendance;
import com.smartevent.repository.AttendanceRepository;
import com.smartevent.service.AttendanceService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@PreAuthorize("hasRole('ADMIN')")
public class AttendanceController {
    private final AttendanceService attendanceService;
    private final AttendanceRepository attendanceRepository;

    public AttendanceController(AttendanceService attendanceService, AttendanceRepository attendanceRepository) {
        this.attendanceService = attendanceService;
        this.attendanceRepository = attendanceRepository;
    }

    public record CheckInRequest(@NotBlank String ticketCode) {}

    @PostMapping("/check-in")
    @ResponseStatus(HttpStatus.CREATED)
    public Attendance checkIn(@Valid @RequestBody CheckInRequest request, Authentication auth) {
        return attendanceService.checkIn(request.ticketCode().trim(), auth.getName());
    }

    @GetMapping("/event/{eventId}")
    public List<Attendance> byEvent(@PathVariable Long eventId) {
        return attendanceRepository.findByBookingEventId(eventId);
    }
}
