package com.printermonitoring.repository;

import com.printermonitoring.entity.Notification;
import com.printermonitoring.enums.NotificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByAlertId(Long alertId);

    List<Notification> findByUserId(Long userId);

    List<Notification> findByStatus(NotificationStatus status);
}
