
package com.smartevent.controller;

import com.smartevent.entity.Attendance;
import com.smartevent.entity.Booking;
import com.smartevent.entity.User;
import com.smartevent.entity.WaitingListEntry;
import com.smartevent.repository.AttendanceRepository;
import com.smartevent.repository.BookingRepository;
import com.smartevent.repository.UserRepository;
import com.smartevent.repository.WaitingListRepository;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BookingRepository bookings;
    private final UserRepository users;
    private final AttendanceRepository attendance;
    private final WaitingListRepository waitingList;

    public AdminController(
            BookingRepository bookings,
            UserRepository users,
            AttendanceRepository attendance,
            WaitingListRepository waitingList) {
        this.bookings = bookings;
        this.users = users;
        this.attendance = attendance;
        this.waitingList = waitingList;
    }

    public record AdminUserResponse(
            Long id,
            String name,
            String email,
            String role,
            LocalDateTime createdAt) {}

    public record AdminBookingResponse(
            Long id,
            String userName,
            String userEmail,
            String eventName,
            String status,
            LocalDateTime bookedAt) {}

    public record AdminAttendanceResponse(
            Long id,
            String attendeeName,
            String attendeeEmail,
            String eventName,
            LocalDateTime checkedInAt,
            String checkedInBy) {}

    public record AdminWaitingListResponse(
            Long id,
            String attendeeName,
            String attendeeEmail,
            String eventName,
            LocalDateTime joinedAt) {}

    @GetMapping("/bookings")
    public List<AdminBookingResponse> getAllBookings() {
        return bookings.findAll().stream()
                .map(b -> new AdminBookingResponse(
                        b.getId(),
                        b.getUser().getName(),
                        b.getUser().getEmail(),
                        b.getEvent().getName(),
                        b.getStatus().name(),
                        b.getBookedAt()))
                .toList();
    }

    @GetMapping("/users")
    public List<AdminUserResponse> getAllUsers() {
        return users.findAll().stream()
                .map(u -> new AdminUserResponse(
                        u.getId(),
                        u.getName(),
                        u.getEmail(),
                        u.getRole().name(),
                        u.getCreatedAt()))
                .toList();
    }

    @GetMapping("/attendance")
    public List<AdminAttendanceResponse> getAllAttendance() {
        return attendance.findAll().stream()
                .map(a -> new AdminAttendanceResponse(
                        a.getId(),
                        a.getBooking().getUser().getName(),
                        a.getBooking().getUser().getEmail(),
                        a.getBooking().getEvent().getName(),
                        a.getCheckedInAt(),
                        a.getCheckedInBy() == null
                                ? null : a.getCheckedInBy().getName()))
                .toList();
    }

    @GetMapping("/waiting-list")
    public List<AdminWaitingListResponse> getAllWaitingListEntries() {
        return waitingList.findAll().stream()
                .map(w -> new AdminWaitingListResponse(
                        w.getId(),
                        w.getUser().getName(),
                        w.getUser().getEmail(),
                        w.getEvent().getName(),
                        w.getJoinedAt()))
                .toList();
    }
}
