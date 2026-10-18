package com.smartevent.controller;

import com.smartevent.entity.WaitingListEntry;
import com.smartevent.repository.WaitingListRepository;
import com.smartevent.repository.UserRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/waiting-list")
public class WaitingListController {
    private final WaitingListRepository waitingList;
    private final UserRepository users;

    public WaitingListController(WaitingListRepository waitingList, UserRepository users) {
        this.waitingList = waitingList;
        this.users = users;
    }

    @GetMapping("/mine")
    public List<WaitingListEntry> mine(Authentication auth) {
        var user = users.findByEmailIgnoreCase(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        return waitingList.findAll().stream()
                .filter(entry -> entry.getUser().getId().equals(user.getId()))
                .toList();
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasRole('ADMIN')")
    public List<WaitingListEntry> byEvent(@PathVariable Long eventId) {
        return waitingList.findByEventIdOrderByJoinedAtAsc(eventId);
    }
}
