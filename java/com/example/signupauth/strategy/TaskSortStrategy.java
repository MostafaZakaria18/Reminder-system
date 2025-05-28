package com.example.signupauth.strategy;

import com.example.signupauth.model.Task;
import java.util.List;

public interface TaskSortStrategy {
    List<Task> sort(List<Task> tasks);
} 