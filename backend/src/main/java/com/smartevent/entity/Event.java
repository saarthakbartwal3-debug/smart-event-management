package com.smartevent.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    @Column(nullable = false, length = 255)
    private String venue;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id")
    private Venue venueEntity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice = BigDecimal.ZERO;

    @Column(nullable = false)
    private Integer capacity = 100;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Event() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDateTime getEventDate() { return eventDate; }
    public void setEventDate(LocalDateTime eventDate) { this.eventDate = eventDate; }
    public String getVenue() { return venue; }
    public void setVenue(String venue) { this.venue = venue; }
    public Venue getVenueEntity() { return venueEntity; }
    public void setVenueEntity(Venue venueEntity) { this.venueEntity = venueEntity; }
    public BigDecimal getTicketPrice() { return ticketPrice; }
    public void setTicketPrice(BigDecimal ticketPrice) { this.ticketPrice = ticketPrice; }
    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
