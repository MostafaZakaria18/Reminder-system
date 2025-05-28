package com.example.signupauth.repository;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.Task.Priority;
import com.example.signupauth.model.User;
import java.util.List;

public interface TaskOperations {
    List<Task> findUpcomingTasks(User user);
    List<Task> findTasksByPriority(User user, Priority priority);
    List<Task> searchTasks(User user, String searchTerm);
    List<Task> findOverdueTasks(User user);
} 