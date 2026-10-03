package com.printermonitoring.dto.notification;

import com.printermonitoring.enums.NotificationChannel;
import com.printermonitoring.enums.NotificationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationRequest {

    @NotNull(message = "Alert ID is required")
    private Long alertId;

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Channel is required")
    private NotificationChannel channel;

    private NotificationStatus status;
    private String failureReason;
}
