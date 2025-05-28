package com.example.signupauth.strategy;

import com.example.signupauth.model.Task;
import org.springframework.stereotype.Component;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class PriorityBasedSortStrategy implements TaskSortStrategy {
    
    @Override
    public List<Task> sort(List<Task> tasks) {
        return tasks.stream()
            .sorted(Comparator
                .comparing(Task::getPriority)
                .thenComparing(Task::getDueDate))
            .collect(Collectors.toList());
    }
} 