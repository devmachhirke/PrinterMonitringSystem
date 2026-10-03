package com.printermonitoring.dto.notification;

import com.printermonitoring.enums.NotificationChannel;
import com.printermonitoring.enums.NotificationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {

    private Long id;
    private Long alertId;
    private String alertTitle;
    private Long userId;
    private String username;
    private NotificationChannel channel;
    private NotificationStatus status;
    private LocalDateTime sentAt;
    private String failureReason;
}
