package com.smartevent.controller;

import com.smartevent.entity.Booking;
import com.smartevent.entity.BookingStatus;
import com.smartevent.repository.BookingRepository;
import com.smartevent.repository.UserRepository;
import com.smartevent.service.BookingService;
import com.smartevent.service.QrCodeService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;
    private final BookingRepository bookings;
    private final UserRepository users;
    private final QrCodeService qrCodeService;

    public BookingController(BookingService bookingService, BookingRepository bookings,
                             UserRepository users, QrCodeService qrCodeService) {
        this.bookingService = bookingService;
        this.bookings = bookings;
        this.users = users;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping("/event/{eventId}")
    @ResponseStatus(HttpStatus.CREATED)
    public Object book(@PathVariable Long eventId, Authentication auth) {
        return bookingService.book(eventId, auth.getName());
    }

    @GetMapping("/mine")
    public List<Booking> mine(Authentication auth) {
        var user = users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return bookings.findByUserIdOrderByBookedAtDesc(user.getId());
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> byEvent(@PathVariable Long eventId) {
        return bookings.findByEventIdOrderByBookedAtAsc(eventId);
    }

    @DeleteMapping("/{bookingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancel(@PathVariable Long bookingId, Authentication auth) {
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        bookingService.cancel(bookingId, auth.getName(), admin);
    }

    @GetMapping("/{bookingId}/qr")
    public ResponseEntity<byte[]> qr(@PathVariable Long bookingId, Authentication auth) {
        Booking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        boolean admin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        if (!admin && !booking.getUser().getEmail().equalsIgnoreCase(auth.getName())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot access another user's ticket.");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Only confirmed bookings have a QR ticket.");
        }
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .body(qrCodeService.createPng(booking.getTicketCode()));
    }
}
