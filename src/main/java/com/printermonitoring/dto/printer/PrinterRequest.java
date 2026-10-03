package com.printermonitoring.dto.printer;

import com.printermonitoring.enums.ConnectionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PrinterRequest {

    @NotBlank(message = "Printer name is required")
    @Size(max = 150, message = "Printer name cannot exceed 150 characters")
    private String name;

    @Size(max = 150, message = "Serial number cannot exceed 150 characters")
    private String serialNumber;

    private String ipAddress;

    private String macAddress;

    private ConnectionType connectionType = ConnectionType.NETWORK;

    private String usbPortName;

    private String osPrinterName;

    private Long printerModelId;

    private Long locationId;


    private Boolean monitoringEnabled = true;

    private Integer monitoringIntervalSeconds = 60;
}