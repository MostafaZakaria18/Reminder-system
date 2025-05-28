package com.example.signupauth.service.urgency;

import com.example.signupauth.model.Task;
import com.example.signupauth.service.TimeCalculationService;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class StandardUrgencyCalculator implements UrgencyCalculator {
    
    private final TimeCalculationService timeCalculationService;
    
    public StandardUrgencyCalculator(TimeCalculationService timeCalculationService) {
        this.timeCalculationService = timeCalculationService;
    }
    
    @Override
    public String calculateUrgencyLevel(Task task) {
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilDue = timeCalculationService.calculateHoursUntilDue(now, task.getDueDate());
        
        if (hoursUntilDue < 0) {
            return "overdue";
        } else if (hoursUntilDue <= 2) {
            return "very-urgent";
        } else if (hoursUntilDue <= 6) {
            return "urgent";
        } else if (hoursUntilDue <= 24) {
            return "upcoming";
        } else {
            return "normal";
        }
    }
    
    @Override
    public boolean appliesTo(Task task) {
        return true; // This is the default calculator
    }
} 