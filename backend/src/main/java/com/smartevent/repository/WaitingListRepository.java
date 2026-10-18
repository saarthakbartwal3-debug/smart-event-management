package com.smartevent.repository;

import com.smartevent.entity.WaitingListEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface WaitingListRepository extends JpaRepository<WaitingListEntry, Long> {
    List<WaitingListEntry> findByEventIdOrderByJoinedAtAsc(Long eventId);
    Optional<WaitingListEntry> findByUserIdAndEventId(Long userId, Long eventId);
}
