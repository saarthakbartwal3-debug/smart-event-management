package com.smartevent.repository;

import com.smartevent.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByNameContainingIgnoreCase(String name);

    @Query("select count(b) from Booking b where b.event.id = :eventId and b.status = com.smartevent.entity.BookingStatus.CONFIRMED")
    long countConfirmedBookings(@Param("eventId") Long eventId);
}
