package com.example.signupauth.controller;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.Task.Priority;
import com.example.signupauth.model.User;
import com.example.signupauth.service.TaskService;
import com.example.signupauth.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDateTime;
import java.util.List;

@Controller
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final TaskService taskService;
    private final NotificationService notificationService;

    @GetMapping("/dashboard")
    public String dashboard(
            @AuthenticationPrincipal User user,
            @RequestParam(required = false) Priority priority,
            Model model) {
        
        // Add notifications for upcoming tasks
        LocalDateTime now = LocalDateTime.now();
        List<Task> upcomingTasks = notificationService.getUpcomingTasks(user, now);
        model.addAttribute("upcomingTasks", upcomingTasks);
        model.addAttribute("notificationService", notificationService);
        
        // Get tasks based on priority filter
        List<Task> tasks;
        if (priority != null) {
            tasks = taskService.getTasksByPriority(user, priority);
            model.addAttribute("selectedPriority", priority);
        } else {
            tasks = taskService.getTasksByPriorityOrder(user);
        }
        
        model.addAttribute("tasks", tasks);
        model.addAttribute("newTask", new Task());
        model.addAttribute("priorities", Priority.values());
        return "dashboard";
    }

    @GetMapping("/tasks/search")
    public String searchTasks(
            @AuthenticationPrincipal User user,
            @RequestParam String query,
            Model model) {
        model.addAttribute("tasks", taskService.searchTasks(user, query));
        model.addAttribute("searchQuery", query);
        model.addAttribute("priorities", Priority.values());
        return "search";
    }

    @GetMapping("/tasks/{taskId}/edit")
    public String editTaskForm(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            Model model) {
        Task task = taskService.getTaskById(taskId);
        if (!task.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to edit this task");
        }
        model.addAttribute("task", task);
        model.addAttribute("priorities", Priority.values());
        return "edit-task";
    }

    @PostMapping("/tasks/{taskId}/edit")
    public String updateTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            @ModelAttribute Task updatedTask,
            @RequestParam("dueDate") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime dueDate,
            RedirectAttributes redirectAttributes) {
        try {
            Task existingTask = taskService.getTaskById(taskId);
            if (!existingTask.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to edit this task");
            }
            
            updatedTask.setUser(user);
            updatedTask.setDueDate(dueDate);
            taskService.updateTask(taskId, updatedTask);
            
            redirectAttributes.addFlashAttribute("successMessage", "Task updated successfully!");
            return "redirect:/dashboard";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Failed to update task: " + e.getMessage());
            return "redirect:/tasks/" + taskId + "/edit";
        }
    }

    @PostMapping("/tasks")
    public String createTask(
            @AuthenticationPrincipal User user,
            @ModelAttribute Task task,
            @RequestParam("dueDate") @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm") LocalDateTime dueDate,
            RedirectAttributes redirectAttributes) {
        try {
            log.info("Creating new task for user: {}", user.getUsername());
            log.info("Task details - Title: {}, Description: {}, Due Date: {}", 
                    task.getTitle(), task.getDescription(), dueDate);
            
            task.setUser(user);
            task.setDueDate(dueDate);
            task.setCompleted(false);
            
            Task savedTask = taskService.saveTask(task);
            log.info("Successfully created task with ID: {}", savedTask.getId());
            redirectAttributes.addFlashAttribute("successMessage", "Task created successfully!");
            return "redirect:/dashboard";
            
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Failed to create task: " + e.getMessage());
            return "redirect:/dashboard";
        }
    }

    @PostMapping("/tasks/{taskId}/toggle")
    public String toggleTaskCompletion(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            RedirectAttributes redirectAttributes) {
        try {
            Task task = taskService.getTaskById(taskId);
            if (!task.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to modify this task");
            }
            taskService.toggleTaskCompletion(taskId);
            redirectAttributes.addFlashAttribute("successMessage", "Task status updated successfully!");
            return "redirect:/dashboard";
        } catch (Exception e) {
            log.error("Error toggling task completion: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Failed to update task status: " + e.getMessage());
            return "redirect:/dashboard";
        }
    }

    @PostMapping("/tasks/{taskId}/delete")
    public String deleteTask(
            @AuthenticationPrincipal User user,
            @PathVariable Long taskId,
            RedirectAttributes redirectAttributes) {
        try {
            Task task = taskService.getTaskById(taskId);
            if (!task.getUser().getId().equals(user.getId())) {
                throw new RuntimeException("Not authorized to delete this task");
            }
            taskService.deleteTask(taskId);
            redirectAttributes.addFlashAttribute("successMessage", "Task deleted successfully!");
            return "redirect:/dashboard";
        } catch (Exception e) {
            log.error("Error deleting task: {}", e.getMessage(), e);
            redirectAttributes.addFlashAttribute("errorMessage", 
                "Failed to delete task: " + e.getMessage());
            return "redirect:/dashboard";
        }
    }
} 