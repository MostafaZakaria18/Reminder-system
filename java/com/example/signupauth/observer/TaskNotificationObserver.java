package com.example.signupauth.observer;

import com.example.signupauth.model.Task;
import com.example.signupauth.service.NotificationService;
import org.springframework.stereotype.Component;

@Component
public class TaskNotificationObserver implements TaskObserver {
    
    private final NotificationService notificationService;
    
    public TaskNotificationObserver(NotificationService notificationService) {
        this.notificationService = notificationService;
    }
    
    @Override
    public void onTaskCreated(Task task) {
        // Send confirmation notification
        sendNotification("Task created: " + task.getTitle(), task);
    }
    
    @Override
    public void onTaskUpdated(Task task) {
        // Send update notification
        sendNotification("Task updated: " + task.getTitle(), task);
    }
    
    @Override
    public void onTaskCompleted(Task task) {
        // Send completion notification
        sendNotification("Task completed: " + task.getTitle(), task);
    }
    
    @Override
    public void onTaskDueSoon(Task task) {
        // Send due soon notification
        String timeRemaining = notificationService.getTimeRemainingText(task);
        sendNotification("Task due soon: " + task.getTitle() + " (" + timeRemaining + ")", task);
    }
    
    private void sendNotification(String message, Task task) {
        // Implementation for sending actual notifications
        System.out.println("Notification: " + message);
    }
} 