package com.smartevent.repository;

import com.smartevent.entity.Booking;
import com.smartevent.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);
    List<Booking> findByEventIdOrderByBookedAtAsc(Long eventId);
    long countByEventIdAndStatus(Long eventId, BookingStatus status);
    Optional<Booking> findByTicketCode(String ticketCode);
    boolean existsByUserIdAndEventIdAndStatus(Long userId, Long eventId, BookingStatus status);
}
