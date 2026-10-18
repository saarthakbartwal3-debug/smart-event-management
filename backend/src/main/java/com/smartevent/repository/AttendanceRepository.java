package com.smartevent.repository;

import com.smartevent.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByBookingId(Long bookingId);
    List<Attendance> findByBookingEventId(Long eventId);
    long countByBookingEventId(Long eventId);
}
