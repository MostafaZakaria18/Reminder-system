package com.example.signupauth.config;

import org.springframework.stereotype.Component;
import java.util.HashMap;
import java.util.Map;

@Component
public class TaskConfigurationManager {
    private static TaskConfigurationManager instance;
    private final Map<String, Object> configurations;
    
    private TaskConfigurationManager() {
        configurations = new HashMap<>();
        // Default configurations
        configurations.put("defaultTaskDuration", 60); // minutes
        configurations.put("maxTasksPerUser", 100);
        configurations.put("notificationThreshold", 24); // hours
        configurations.put("enableEmailNotifications", true);
    }
    
    public static synchronized TaskConfigurationManager getInstance() {
        if (instance == null) {
            instance = new TaskConfigurationManager();
        }
        return instance;
    }
    
    public Object getConfiguration(String key) {
        return configurations.get(key);
    }
    
    public void setConfiguration(String key, Object value) {
        configurations.put(key, value);
    }
    
    public boolean hasConfiguration(String key) {
        return configurations.containsKey(key);
    }
} 