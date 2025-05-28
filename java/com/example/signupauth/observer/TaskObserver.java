package com.example.signupauth.observer;

import com.example.signupauth.model.Task;

public interface TaskObserver {
    void onTaskCreated(Task task);
    void onTaskUpdated(Task task);
    void onTaskCompleted(Task task);
    void onTaskDueSoon(Task task);
} 