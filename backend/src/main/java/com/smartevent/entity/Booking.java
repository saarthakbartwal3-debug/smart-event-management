package com.smartevent.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings",
       uniqueConstraints = @UniqueConstraint(name = "uk_booking_user_event", columnNames = {"user_id", "event_id"}))
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(nullable = false, unique = true, length = 80)
    private String ticketCode;

    @Column(nullable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    public Booking() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public BookingStatus getStatus() { return status; }
    public void setStatus(BookingStatus status) { this.status = status; }
    public String getTicketCode() { return ticketCode; }
    public void setTicketCode(String ticketCode) { this.ticketCode = ticketCode; }
    public LocalDateTime getBookedAt() { return bookedAt; }
    public void setBookedAt(LocalDateTime bookedAt) { this.bookedAt = bookedAt; }
}
