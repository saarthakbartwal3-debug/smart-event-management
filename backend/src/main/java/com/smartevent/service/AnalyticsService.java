package com.smartevent.service;

import com.smartevent.entity.BookingStatus;
import com.smartevent.entity.Event;
import com.smartevent.repository.AttendanceRepository;
import com.smartevent.repository.BookingRepository;
import com.smartevent.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {
    private final EventRepository events;
    private final BookingRepository bookings;
    private final AttendanceRepository attendance;

    public AnalyticsService(EventRepository events, BookingRepository bookings, AttendanceRepository attendance) {
        this.events = events;
        this.bookings = bookings;
        this.attendance = attendance;
    }

    public Map<String, Object> dashboard() {
        List<Event> all = events.findAll();
        long confirmed = all.stream().mapToLong(e ->
                bookings.countByEventIdAndStatus(e.getId(), BookingStatus.CONFIRMED)).sum();
        long attended = all.stream().mapToLong(e -> attendance.countByBookingEventId(e.getId())).sum();
        double attendanceRate = confirmed == 0 ? 0.0 : Math.round((attended * 10000.0 / confirmed)) / 100.0;
        List<Map<String, Object>> eventStats = all.stream().map(event -> {
            long registered = bookings.countByEventIdAndStatus(event.getId(), BookingStatus.CONFIRMED);
            long present = attendance.countByBookingEventId(event.getId());
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("eventId", event.getId());
            row.put("eventName", event.getName());
            row.put("capacity", event.getCapacity());
            row.put("registrations", registered);
            row.put("attended", present);
            row.put("occupancyPercentage", event.getCapacity() == 0 ? 0 :
                    Math.round(registered * 10000.0 / event.getCapacity()) / 100.0);
            row.put("attendancePercentage", registered == 0 ? 0 :
                    Math.round(present * 10000.0 / registered) / 100.0);
            return row;
        }).toList();
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("totalEvents", all.size());
        result.put("confirmedRegistrations", confirmed);
        result.put("totalAttended", attended);
        result.put("overallAttendancePercentage", attendanceRate);
        result.put("events", eventStats);
        return result;
    }
}
