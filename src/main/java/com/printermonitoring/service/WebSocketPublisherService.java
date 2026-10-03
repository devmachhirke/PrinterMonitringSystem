package com.printermonitoring.service;

import com.printermonitoring.dto.printer.PrinterPingResultResponse;
import com.printermonitoring.dto.printer.SnmpPrinterDataResponse;
import com.printermonitoring.dto.toner.TonerStatusResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class WebSocketPublisherService {

    private final SimpMessagingTemplate messagingTemplate;

    public void publishPrinterPing(PrinterPingResultResponse pingResult) {
        if (pingResult != null) {
            log.info("Publishing real-time printer ping via WebSocket to /topic/printer-pings: {}", pingResult.getPrinterName());
            messagingTemplate.convertAndSend("/topic/printer-pings", pingResult);
        }
    }

    public void publishSnmpTelemetry(SnmpPrinterDataResponse telemetry) {
        if (telemetry != null) {
            log.info("Publishing real-time SNMP telemetry via WebSocket to /topic/telemetry: {}", telemetry.getPrinterName());
            messagingTemplate.convertAndSend("/topic/telemetry", telemetry);
        }
    }

    public void publishTonerUpdate(TonerStatusResponse tonerStatus) {
        if (tonerStatus != null) {
            messagingTemplate.convertAndSend("/topic/toner-updates", tonerStatus);
        }
    }

    public void publishAlert(Object alert) {
        log.info("Publishing real-time alert via WebSocket to /topic/alerts");
        messagingTemplate.convertAndSend("/topic/alerts", alert);
    }
}
