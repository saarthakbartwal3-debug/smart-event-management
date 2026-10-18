package com.smartevent.service;

import com.smartevent.entity.*;
import com.smartevent.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AttendanceService {
    private final BookingRepository bookings;
    private final AttendanceRepository attendance;
    private final UserRepository users;

    public AttendanceService(BookingRepository bookings, AttendanceRepository attendance, UserRepository users) {
        this.bookings = bookings;
        this.attendance = attendance;
        this.users = users;
    }

    @Transactional
    public Attendance checkIn(String ticketCode, String adminEmail) {
        Booking booking = bookings.findByTicketCode(ticketCode)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invalid ticket code."));
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This booking is not active.");
        }
        if (attendance.findByBookingId(booking.getId()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This ticket has already been checked in.");
        }
        User admin = users.findByEmailIgnoreCase(adminEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        Attendance record = new Attendance();
        record.setBooking(booking);
        record.setCheckedInBy(admin);
        return attendance.save(record);
    }
}
