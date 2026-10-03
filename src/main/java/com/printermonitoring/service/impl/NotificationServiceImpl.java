package com.printermonitoring.service.impl;

import com.printermonitoring.dto.notification.NotificationRequest;
import com.printermonitoring.dto.notification.NotificationResponse;
import com.printermonitoring.entity.Alert;
import com.printermonitoring.entity.Notification;
import com.printermonitoring.entity.User;
import com.printermonitoring.enums.NotificationStatus;
import com.printermonitoring.repository.AlertRepository;
import com.printermonitoring.repository.NotificationRepository;
import com.printermonitoring.repository.UserRepository;
import com.printermonitoring.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final AlertRepository alertRepository;
    private final UserRepository userRepository;

    @Override
    public NotificationResponse sendNotification(NotificationRequest request) {
        Alert alert = alertRepository.findById(request.getAlertId())
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + request.getAlertId()));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Notification notification = new Notification();
        notification.setAlert(alert);
        notification.setUser(user);
        notification.setChannel(request.getChannel());
        notification.setStatus(request.getStatus() != null ? request.getStatus() : NotificationStatus.SENT);
        notification.setSentAt(LocalDateTime.now());
        notification.setFailureReason(request.getFailureReason());

        Notification saved = notificationRepository.save(notification);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByAlert(Long alertId) {
        return notificationRepository.findByAlertId(alertId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationResponse> getAllNotifications() {
        return notificationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationResponse getNotificationById(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        return mapToResponse(notification);
    }

    @Override
    public void deleteNotification(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new RuntimeException("Notification not found with id: " + id);
        }
        notificationRepository.deleteById(id);
    }

    private NotificationResponse mapToResponse(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .alertId(notification.getAlert().getId())
                .alertTitle(notification.getAlert().getTitle())
                .userId(notification.getUser().getId())
                .username(notification.getUser().getUsername())
                .channel(notification.getChannel())
                .status(notification.getStatus())
                .sentAt(notification.getSentAt())
                .failureReason(notification.getFailureReason())
                .build();
    }
}
