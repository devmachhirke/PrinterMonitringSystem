package com.printermonitoring.entity;

import com.printermonitoring.enums.ConnectionType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "printers",
        indexes = {
                @Index(name = "idx_printer_serial", columnList = "serial_number"),
                @Index(name = "idx_printer_ip", columnList = "ip_address")
        }
)
@Getter
@Setter
public class Printer extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "serial_number", unique = true, length = 150)
    private String serialNumber;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Column(name = "mac_address", length = 50)
    private String macAddress;

    @Enumerated(EnumType.STRING)
    @Column(name = "connection_type", length = 20)
    private ConnectionType connectionType = ConnectionType.NETWORK;

    @Column(name = "usb_port_name", length = 100)
    private String usbPortName;

    @Column(name = "os_printer_name", length = 150)
    private String osPrinterName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "printer_model_id")
    private PrinterModel printerModel;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private PrinterLocation location;

    @Column(name = "monitoring_enabled")
    private Boolean monitoringEnabled = true;

    @Column(name = "monitoring_interval_seconds")
    private Integer monitoringIntervalSeconds = 60;

    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;
}