package com.example.signupauth.service;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.User;
import com.example.signupauth.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    
    private final TaskRepository taskRepository;
    
    public List<Task> getUpcomingTasks(User user, LocalDateTime now) {
        List<Task> userTasks = taskRepository.findByUser(user);
        return userTasks.stream()
            .filter(task -> !task.isCompleted())
            .filter(task -> isTaskUpcoming(task, now))
            .collect(Collectors.toList());
    }
    
    private boolean isTaskUpcoming(Task task, LocalDateTime now) {
        long hoursUntilDue = ChronoUnit.HOURS.between(now, task.getDueDate());
        return hoursUntilDue >= 0 && hoursUntilDue <= 24;
    }
    
    public String getTimeRemainingText(Task task) {
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilDue = ChronoUnit.HOURS.between(now, task.getDueDate());
        
        if (hoursUntilDue < 0) {
            return "Overdue";
        } else if (hoursUntilDue == 0) {
            return "Due now";
        } else if (hoursUntilDue == 1) {
            return "Due in 1 hour";
        } else if (hoursUntilDue < 24) {
            return "Due in " + hoursUntilDue + " hours";
        } else {
            return "Due in " + (hoursUntilDue / 24) + " days";
        }
    }
    
    public String getUrgencyClass(Task task) {
        LocalDateTime now = LocalDateTime.now();
        long hoursUntilDue = ChronoUnit.HOURS.between(now, task.getDueDate());
        
        if (hoursUntilDue < 0) {
            return "task-overdue";
        } else if (hoursUntilDue <= 2) {
            return "task-urgent";
        } else if (hoursUntilDue <= 6) {
            return "task-warning";
        } else {
            return "task-normal";
        }
    }
} 