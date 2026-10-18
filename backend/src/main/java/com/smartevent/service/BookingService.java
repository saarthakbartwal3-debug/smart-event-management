package com.smartevent.service;

import com.smartevent.entity.*;
import com.smartevent.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.UUID;

@Service
public class BookingService {
    private final BookingRepository bookings;
    private final EventRepository events;
    private final UserRepository users;
    private final WaitingListRepository waitingList;

    public BookingService(BookingRepository bookings, EventRepository events,
                          UserRepository users, WaitingListRepository waitingList) {
        this.bookings = bookings;
        this.events = events;
        this.users = users;
        this.waitingList = waitingList;
    }

    @Transactional
    public Object book(Long eventId, String email) {
        Event event = events.findById(eventId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
        User user = users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (bookings.existsByUserIdAndEventIdAndStatus(user.getId(), eventId, BookingStatus.CONFIRMED)
                || waitingList.findByUserIdAndEventId(user.getId(), eventId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "You already have a booking or waiting-list entry.");
        }
        long confirmed = bookings.countByEventIdAndStatus(eventId, BookingStatus.CONFIRMED);
        if (confirmed >= event.getCapacity()) {
            WaitingListEntry entry = new WaitingListEntry();
            entry.setEvent(event);
            entry.setUser(user);
            return waitingList.save(entry);
        }
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(user);
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTicketCode(UUID.randomUUID().toString());
        return bookings.save(booking);
    }

    @Transactional
    public void cancel(Long bookingId, String email, boolean admin) {
        Booking booking = bookings.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found."));
        if (!admin && !booking.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You cannot cancel another user's booking.");
        }
        if (booking.getStatus() != BookingStatus.CONFIRMED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Booking is not active.");
        }
        booking.setStatus(BookingStatus.CANCELLED);
        bookings.save(booking);
        promoteFirstWaitingUser(booking.getEvent());
    }

    private void promoteFirstWaitingUser(Event event) {
        List<WaitingListEntry> entries = waitingList.findByEventIdOrderByJoinedAtAsc(event.getId());
        if (entries.isEmpty()) return;
        WaitingListEntry first = entries.get(0);
        Booking booking = new Booking();
        booking.setEvent(event);
        booking.setUser(first.getUser());
        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setTicketCode(UUID.randomUUID().toString());
        bookings.save(booking);
        waitingList.delete(first);
    }
}
