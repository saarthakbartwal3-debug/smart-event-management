package com.smartevent.controller;

import com.smartevent.entity.Event;
import com.smartevent.repository.EventRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get event by ID
    @GetMapping("/{id}")
    public Event getEventById(@PathVariable Long id) {
        return eventRepository.findById(id).orElse(null);
    }

    // Create a new event
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Event createEvent(@RequestBody Event event) {
        event.setId(null);
        return eventRepository.save(event);
    }
    // Update an existing event
@PutMapping("/{id}")
public Event updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
    return eventRepository.findById(id)
            .map(existingEvent -> {
                existingEvent.setName(updatedEvent.getName());
                existingEvent.setDescription(updatedEvent.getDescription());
                existingEvent.setEventDate(updatedEvent.getEventDate());
                existingEvent.setVenue(updatedEvent.getVenue());
                existingEvent.setTicketPrice(updatedEvent.getTicketPrice());

                return eventRepository.save(existingEvent);
            })
            .orElse(null);
}

// Delete an event
@DeleteMapping("/{id}")
@ResponseStatus(HttpStatus.NO_CONTENT)
public void deleteEvent(@PathVariable Long id) {
    eventRepository.deleteById(id);
}
}