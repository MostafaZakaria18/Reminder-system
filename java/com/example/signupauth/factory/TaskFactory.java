package com.example.signupauth.factory;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.User;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
public class TaskFactory {
    
    public Task createRegularTask(String title, String description, LocalDateTime dueDate, User user) {
        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setUser(user);
        task.setPriority(Task.Priority.MEDIUM);
        task.setCompleted(false);
        return task;
    }
    
    public Task createUrgentTask(String title, String description, LocalDateTime dueDate, User user) {
        Task task = new Task();
        task.setTitle("URGENT: " + title);
        task.setDescription(description);
        task.setDueDate(dueDate);
        task.setUser(user);
        task.setPriority(Task.Priority.HIGH);
        task.setCompleted(false);
        return task;
    }
    
    public Task createReminderTask(String title, LocalDateTime dueDate, User user) {
        Task task = new Task();
        task.setTitle("REMINDER: " + title);
        task.setDescription("Quick reminder");
        task.setDueDate(dueDate);
        task.setUser(user);
        task.setPriority(Task.Priority.LOW);
        task.setCompleted(false);
        return task;
    }
} 