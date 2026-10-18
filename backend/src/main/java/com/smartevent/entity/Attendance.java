package com.smartevent.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance",
       uniqueConstraints = @UniqueConstraint(name = "uk_attendance_booking", columnNames = "booking_id"))
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private LocalDateTime checkedInAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "checked_in_by")
    private User checkedInBy;

    public Attendance() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Booking getBooking() { return booking; }
    public void setBooking(Booking booking) { this.booking = booking; }
    public LocalDateTime getCheckedInAt() { return checkedInAt; }
    public void setCheckedInAt(LocalDateTime checkedInAt) { this.checkedInAt = checkedInAt; }
    public User getCheckedInBy() { return checkedInBy; }
    public void setCheckedInBy(User checkedInBy) { this.checkedInBy = checkedInBy; }
}
