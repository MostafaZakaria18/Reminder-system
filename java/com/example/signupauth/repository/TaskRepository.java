package com.example.signupauth.repository;

import com.example.signupauth.model.Task;
import com.example.signupauth.model.Task.Priority;
import com.example.signupauth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUser(User user);
    List<Task> findByUserOrderByDueDateAsc(User user);
    List<Task> findByUserAndCompletedOrderByDueDateAsc(User user, boolean completed);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user AND " +
           "(LOWER(t.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
           "ORDER BY t.dueDate ASC")
    List<Task> searchTasks(@Param("user") User user, @Param("searchTerm") String searchTerm);
    
    List<Task> findByUserAndPriorityOrderByDueDateAsc(User user, Priority priority);
    
    @Query("SELECT t FROM Task t WHERE t.user = :user ORDER BY " +
           "CASE t.priority " +
           "    WHEN 'HIGH' THEN 1 " +
           "    WHEN 'MEDIUM' THEN 2 " +
           "    WHEN 'LOW' THEN 3 " +
           "END, t.dueDate ASC")
    List<Task> findByUserOrderByPriorityAndDueDate(@Param("user") User user);
} 