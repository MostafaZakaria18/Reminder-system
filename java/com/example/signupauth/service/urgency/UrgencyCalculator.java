package com.example.signupauth.service.urgency;

import com.example.signupauth.model.Task;

public interface UrgencyCalculator {
    String calculateUrgencyLevel(Task task);
    boolean appliesTo(Task task);
} 