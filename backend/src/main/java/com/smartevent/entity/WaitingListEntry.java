package com.smartevent.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "waiting_list",
       uniqueConstraints = @UniqueConstraint(name = "uk_waitlist_user_event", columnNames = {"user_id", "event_id"}))
public class WaitingListEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @Column(nullable = false)
    private LocalDateTime joinedAt = LocalDateTime.now();

    public WaitingListEntry() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Event getEvent() { return event; }
    public void setEvent(Event event) { this.event = event; }
    public LocalDateTime getJoinedAt() { return joinedAt; }
    public void setJoinedAt(LocalDateTime joinedAt) { this.joinedAt = joinedAt; }
}
