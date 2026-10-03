package com.printermonitoring.service.impl;

import com.printermonitoring.dto.printer.PrinterPingResultResponse;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.entity.PrinterStatusHistory;
import com.printermonitoring.enums.ConnectionType;
import com.printermonitoring.enums.PrinterStatus;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.repository.PrinterStatusHistoryRepository;
import com.printermonitoring.service.PrinterMonitoringService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import java.net.InetAddress;
import java.net.Socket;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PrinterMonitoringServiceImpl implements PrinterMonitoringService {

    private final PrinterRepository printerRepository;
    private final PrinterStatusHistoryRepository statusHistoryRepository;

    private static final int TIMEOUT_MS = 3000; // 3 seconds timeout

    @Override
    public PrinterPingResultResponse pingPrinter(Long printerId) {
        Printer printer = printerRepository.findById(printerId)
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + printerId));

        return executePingAndLog(printer);
    }

    @Override
    public List<PrinterPingResultResponse> pollAllPrinters() {
        List<Printer> monitoredPrinters = printerRepository.findAll()
                .stream()
                .filter(p -> Boolean.TRUE.equals(p.getMonitoringEnabled()))
                .toList();

        List<PrinterPingResultResponse> results = new ArrayList<>();
        for (Printer printer : monitoredPrinters) {
            results.add(executePingAndLog(printer));
        }

        return results;
    }

    // Automated background scheduled polling task running every 60 seconds
    @Scheduled(fixedRateString = "${printer.monitoring.poll-rate-ms:60000}")
    public void scheduledPolling() {
        log.info("Starting automated background printer status polling (Network & USB)...");
        try {
            List<PrinterPingResultResponse> results = pollAllPrinters();
            log.info("Automated printer polling finished. Checked {} printers.", results.size());
        } catch (Exception e) {
            log.error("Error during scheduled printer polling", e);
        }
    }

    private PrinterPingResultResponse executePingAndLog(Printer printer) {
        LocalDateTime now = LocalDateTime.now();
        boolean isReachable = false;
        long startTime = System.currentTimeMillis();
        int responseTimeMs = 0;
        String connectionInfo;

        if (printer.getConnectionType() == ConnectionType.USB) {
            connectionInfo = "USB Port: " + (printer.getUsbPortName() != null ? printer.getUsbPortName() : "Local USB")
                    + " (" + (printer.getOsPrinterName() != null ? printer.getOsPrinterName() : printer.getName()) + ")";
            isReachable = checkUsbPrinterReachable(printer);
        } else {
            // Default: NETWORK (IP address check)
            connectionInfo = "IP: " + (printer.getIpAddress() != null ? printer.getIpAddress() : "N/A");
            isReachable = checkNetworkPrinterReachable(printer.getIpAddress());
        }

        long endTime = System.currentTimeMillis();
        responseTimeMs = isReachable ? (int) (endTime - startTime) : 0;
        PrinterStatus status = isReachable ? PrinterStatus.ONLINE : PrinterStatus.OFFLINE;

        if (isReachable) {
            printer.setLastSeenAt(now);
            printerRepository.save(printer);
        }

        // Log to status history table
        PrinterStatusHistory history = new PrinterStatusHistory();
        history.setPrinter(printer);
        history.setStatus(status);
        history.setResponseTimeMs(responseTimeMs);
        history.setCheckedAt(now);
        statusHistoryRepository.save(history);

        String message = isReachable
                ? "Printer is ONLINE via " + printer.getConnectionType() + " (" + responseTimeMs + " ms)"
                : "Printer is OFFLINE or disconnected [" + connectionInfo + "]";

        return PrinterPingResultResponse.builder()
                .printerId(printer.getId())
                .printerName(printer.getName())
                .ipAddress(printer.getIpAddress())
                .status(status)
                .responseTimeMs(responseTimeMs)
                .checkedAt(now)
                .message(message)
                .build();
    }

    private boolean checkNetworkPrinterReachable(String ipAddress) {
        if (ipAddress == null || ipAddress.isBlank()) {
            return false;
        }

        try {
            InetAddress inet = InetAddress.getByName(ipAddress);
            if (inet.isReachable(TIMEOUT_MS)) {
                return true;
            }

            // Fallback TCP socket checks on port 9100 or 80
            try (Socket socket = new Socket()) {
                socket.connect(new java.net.InetSocketAddress(ipAddress, 9100), TIMEOUT_MS);
                return true;
            } catch (Exception ignored) {
                try (Socket socket = new Socket()) {
                    socket.connect(new java.net.InetSocketAddress(ipAddress, 80), TIMEOUT_MS);
                    return true;
                } catch (Exception ignoredSocket) {
                    return false;
                }
            }
        } catch (Exception e) {
            return false;
        }
    }

    private boolean checkUsbPrinterReachable(Printer printer) {
        try {
            PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
            String targetOsName = printer.getOsPrinterName() != null ? printer.getOsPrinterName() : printer.getName();

            for (PrintService service : services) {
                String serviceName = service.getName();
                if (serviceName.equalsIgnoreCase(targetOsName) || serviceName.toLowerCase().contains(targetOsName.toLowerCase())) {
                    return true;
                }
            }
        } catch (Exception e) {
            log.error("Error checking USB printer status for printer ID: {}", printer.getId(), e);
        }
        return false;
    }
}
