package com.smartevent.controller;

import com.smartevent.entity.Event;
import com.smartevent.entity.Venue;
import com.smartevent.repository.EventRepository;
import com.smartevent.repository.VenueRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository events;
    private final VenueRepository venues;

    public EventController(EventRepository events, VenueRepository venues) {
        this.events = events;
        this.venues = venues;
    }

    public record EventRequest(
            @NotBlank @Size(max = 160) String name,
            @Size(max = 2000) String description,
            @NotNull java.time.LocalDateTime eventDate,
            @NotBlank @Size(max = 255) String venue,
            Long venueId,
            @NotNull @DecimalMin("0.00") BigDecimal ticketPrice,
            @NotNull @Min(1) @Max(1000000) Integer capacity) {}

    @GetMapping
    public List<Event> getAll(@RequestParam(required = false) String search) {
        return (search == null || search.isBlank()) ? events.findAll() : events.findByNameContainingIgnoreCase(search);
    }

    @GetMapping("/{id}")
    public Event getById(@PathVariable Long id) {
        return events.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Event create(@Valid @RequestBody EventRequest request) {
        Event event = new Event();
        apply(event, request);
        return events.save(event);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Event update(@PathVariable Long id, @Valid @RequestBody EventRequest request) {
        Event event = events.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found."));
        apply(event, request);
        return events.save(event);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        if (!events.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found.");
        events.deleteById(id);
    }

    private void apply(Event event, EventRequest request) {
        event.setName(request.name().trim());
        event.setDescription(request.description());
        event.setEventDate(request.eventDate());
        event.setVenue(request.venue().trim());
        event.setTicketPrice(request.ticketPrice());
        event.setCapacity(request.capacity());
        if (request.venueId() != null) {
            Venue venue = venues.findById(request.venueId()).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.BAD_REQUEST, "Venue ID not found."));
            if (request.capacity() > venue.getCapacity()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Event capacity cannot exceed venue capacity.");
            }
            event.setVenueEntity(venue);
            event.setVenue(venue.getName());
        } else {
            event.setVenueEntity(null);
        }
    }
}
