package com.example.signupauth.service;

import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
public class TimeCalculationService {
    
    public long calculateHoursUntilDue(LocalDateTime now, LocalDateTime dueDate) {
        return ChronoUnit.HOURS.between(now, dueDate);
    }
    
    public long calculateMinutesUntilDue(LocalDateTime now, LocalDateTime dueDate) {
        return ChronoUnit.MINUTES.between(now, dueDate);
    }
    
    public long calculateDaysUntilDue(LocalDateTime now, LocalDateTime dueDate) {
        return ChronoUnit.DAYS.between(now, dueDate);
    }
    
    public boolean isWithinTimeFrame(LocalDateTime now, LocalDateTime dueDate, long hours) {
        long hoursUntilDue = calculateHoursUntilDue(now, dueDate);
        return hoursUntilDue >= 0 && hoursUntilDue <= hours;
    }
} 