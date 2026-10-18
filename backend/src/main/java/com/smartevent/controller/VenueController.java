package com.smartevent.controller;

import com.smartevent.entity.Venue;
import com.smartevent.repository.VenueRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    private final VenueRepository venues;
    public VenueController(VenueRepository venues) { this.venues = venues; }

    public record VenueRequest(@NotBlank @Size(max = 120) String name,
                               @NotBlank @Size(max = 255) String location,
                               @NotNull @Min(1) Integer capacity,
                               @Size(max = 1000) String description) {}

    @GetMapping
    public List<Venue> all() { return venues.findAll(); }

    @GetMapping("/{id}")
    public Venue one(@PathVariable Long id) {
        return venues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue not found."));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasRole('ADMIN')")
    public Venue create(@Valid @RequestBody VenueRequest request) {
        Venue venue = new Venue();
        apply(venue, request);
        return venues.save(venue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Venue update(@PathVariable Long id, @Valid @RequestBody VenueRequest request) {
        Venue venue = venues.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue not found."));
        apply(venue, request);
        return venues.save(venue);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        if (!venues.existsById(id)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Venue not found.");
        venues.deleteById(id);
    }

    private void apply(Venue venue, VenueRequest request) {
        venue.setName(request.name().trim());
        venue.setLocation(request.location().trim());
        venue.setCapacity(request.capacity());
        venue.setDescription(request.description());
    }
}
