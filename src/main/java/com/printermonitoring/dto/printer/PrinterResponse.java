package com.printermonitoring.dto.printer;

import com.printermonitoring.enums.ConnectionType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class PrinterResponse {

    private Long id;

    private String name;

    private String serialNumber;

    private String ipAddress;

    private String macAddress;

    private ConnectionType connectionType;

    private String usbPortName;

    private String osPrinterName;

    private Long printerModelId;

    private Long locationId;

    private Boolean monitoringEnabled;

    private Integer monitoringIntervalSeconds;

    private LocalDateTime lastSeenAt;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}