package com.printermonitoring.scheduler;

import com.printermonitoring.dto.printer.PrinterPingResultResponse;
import com.printermonitoring.dto.printer.SnmpPrinterDataResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.enums.ConnectionType;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.PrinterMonitoringService;
import com.printermonitoring.service.SnmpService;
import com.printermonitoring.service.WebSocketPublisherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class PrinterTelemetryScheduler {

    private final PrinterMonitoringService monitoringService;
    private final SnmpService snmpService;
    private final PrinterRepository printerRepository;
    private final WebSocketPublisherService webSocketPublisher;

    /**
     * Periodically polls network and USB printers every 10 seconds and broadcasts
     * ping & SNMP telemetry over WebSockets to all connected Next.js frontends.
     */
    @Scheduled(fixedRate = 10000)
    public void pushRealtimeTelemetry() {
        try {
            log.info("Executing scheduled real-time telemetry broadcast via WebSockets...");
            
            // 1. Poll ping status of all registered printers
            List<PrinterPingResultResponse> pings = monitoringService.pollAllPrinters();
            for (PrinterPingResultResponse ping : pings) {
                webSocketPublisher.publishPrinterPing(ping);
            }

            // 2. Poll SNMP status for Network Printers
            List<Printer> networkPrinters = printerRepository.findAll().stream()
                    .filter(p -> p.getConnectionType() == ConnectionType.NETWORK && Boolean.TRUE.equals(p.getMonitoringEnabled()))
                    .toList();

            for (Printer printer : networkPrinters) {
                try {
                    SnmpPrinterDataResponse telemetry = snmpService.pollPrinterBySnmp(printer.getId());
                    webSocketPublisher.publishSnmpTelemetry(telemetry);
                } catch (Exception ex) {
                    log.warn("Error polling SNMP telemetry for printer ID {}", printer.getId(), ex);
                }
            }

        } catch (Exception e) {
            log.error("Error pushing scheduled real-time telemetry updates", e);
        }
    }
}
