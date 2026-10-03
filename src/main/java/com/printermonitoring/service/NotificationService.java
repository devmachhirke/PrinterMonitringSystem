package com.printermonitoring.service;

import com.printermonitoring.dto.notification.NotificationRequest;
import com.printermonitoring.dto.notification.NotificationResponse;

import java.util.List;

public interface NotificationService {
    NotificationResponse sendNotification(NotificationRequest request);
    List<NotificationResponse> getNotificationsByAlert(Long alertId);
    List<NotificationResponse> getNotificationsByUser(Long userId);
    List<NotificationResponse> getAllNotifications();
    NotificationResponse getNotificationById(Long id);
    void deleteNotification(Long id);
}
