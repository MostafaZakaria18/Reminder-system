package com.example.signupauth.service.task;

import com.example.signupauth.model.Task;

public interface TaskTimeService {
    String getTimeRemainingText(Task task);
    boolean isTaskUpcoming(Task task);
    boolean isTaskOverdue(Task task);
} 