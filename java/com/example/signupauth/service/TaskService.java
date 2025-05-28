package com.example.signupauth.service;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.Task.Priority;
import com.example.signupauth.model.User;
import com.example.signupauth.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TaskService {
    private final TaskRepository taskRepository;

    @Transactional(readOnly = true)
    public List<Task> getTasksByUser(User user) {
        return taskRepository.findByUserOrderByDueDateAsc(user);
    }

    public List<Task> getTasksByUserAndStatus(User user, boolean completed) {
        return taskRepository.findByUserAndCompletedOrderByDueDateAsc(user, completed);
    }

    @Transactional
    public Task saveTask(Task task) {
        try {
            log.info("Attempting to save task: {}", task);
            if (task.getUser() == null) {
                log.error("User is null for task");
                throw new IllegalArgumentException("User cannot be null");
            }
            if (task.getDueDate() == null) {
                log.error("Due date is null for task");
                throw new IllegalArgumentException("Due date cannot be null");
            }
            if (task.getTitle() == null || task.getTitle().trim().isEmpty()) {
                log.error("Title is null or empty for task");
                throw new IllegalArgumentException("Title cannot be empty");
            }
            Task savedTask = taskRepository.save(task);
            log.info("Successfully saved task with ID: {}", savedTask.getId());
            return savedTask;
        } catch (Exception e) {
            log.error("Error saving task: {}", e.getMessage(), e);
            throw e;
        }
    }

    @Transactional
    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }

    @Transactional
    public void toggleTaskCompletion(Long taskId) {
        Task task = getTaskById(taskId);
        task.setCompleted(!task.isCompleted());
        taskRepository.save(task);
    }

    @Transactional
    public void updateTask(Long taskId, Task updatedTask) {
        Task existingTask = getTaskById(taskId);
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setDueDate(updatedTask.getDueDate());
        existingTask.setPriority(updatedTask.getPriority());
        taskRepository.save(existingTask);
    }

    @Transactional(readOnly = true)
    public List<Task> searchTasks(User user, String searchTerm) {
        return taskRepository.searchTasks(user, searchTerm);
    }

    public List<Task> getTasksByPriority(User user, Priority priority) {
        return taskRepository.findByUserAndPriorityOrderByDueDateAsc(user, priority);
    }

    public List<Task> getTasksByPriorityOrder(User user) {
        return taskRepository.findByUserOrderByPriorityAndDueDate(user);
    }

    @Transactional(readOnly = true)
    public Task getTaskById(Long taskId) {
        return taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found"));
    }
} 