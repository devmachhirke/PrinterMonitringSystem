package com.printermonitoring.service.impl;

import com.printermonitoring.dto.print.PrintJobRequest;
import com.printermonitoring.dto.print.PrintJobResponse;
import com.printermonitoring.entity.PrintJob;
import com.printermonitoring.entity.Printer;
import com.printermonitoring.enums.ConnectionType;
import com.printermonitoring.enums.PrintJobStatus;
import com.printermonitoring.repository.PrintJobRepository;
import com.printermonitoring.repository.PrinterRepository;
import com.printermonitoring.service.PrintJobService;
import com.printermonitoring.service.WebSocketPublisherService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.print.*;
import javax.print.attribute.HashPrintRequestAttributeSet;
import javax.print.attribute.PrintRequestAttributeSet;
import javax.print.attribute.standard.Copies;

import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class PrintJobServiceImpl implements PrintJobService {

    private final PrintJobRepository printJobRepository;
    private final PrinterRepository printerRepository;
    private final WebSocketPublisherService webSocketPublisher;

    private static final int RAW_PRINT_PORT = 9100; // HP JetDirect RAW Socket printing port

    @Override
    public PrintJobResponse submitPrintJob(PrintJobRequest request) {
        Printer printer = printerRepository.findById(request.getPrinterId())
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + request.getPrinterId()));

        PrintJob job = new PrintJob();
        job.setPrinter(printer);
        job.setJobName(request.getJobName());
        job.setDocumentType(request.getDocumentType() != null ? request.getDocumentType() : "TEXT");
        job.setContent(request.getContent());
        job.setCopies(request.getCopies() != null && request.getCopies() > 0 ? request.getCopies() : 1);
        job.setPrintedBy(request.getPrintedBy() != null ? request.getPrintedBy() : "System User");
        job.setStatus(PrintJobStatus.PENDING);
        job.setSubmittedAt(LocalDateTime.now());

        PrintJob savedJob = printJobRepository.save(job);

        // Execute physical hardware print action
        boolean success = executePhysicalPrint(printer, savedJob);

        if (success) {
            savedJob.setStatus(PrintJobStatus.COMPLETED);
            savedJob.setCompletedAt(LocalDateTime.now());
            savedJob.setErrorMessage(null);
            log.info("Print job ID {} completed successfully on printer {}", savedJob.getId(), printer.getName());
        } else {
            savedJob.setStatus(PrintJobStatus.FAILED);
            savedJob.setCompletedAt(LocalDateTime.now());
            log.warn("Print job ID {} failed on printer {}", savedJob.getId(), printer.getName());
        }

        PrintJob finalJob = printJobRepository.save(savedJob);
        PrintJobResponse response = mapToResponse(finalJob);

        // Broadcast real-time WebSocket alert/update
        webSocketPublisher.publishAlert(response);

        return response;
    }

    @Override
    public PrintJobResponse printTestPage(Long printerId, String printedBy) {
        Printer printer = printerRepository.findById(printerId)
                .orElseThrow(() -> new RuntimeException("Printer not found with id: " + printerId));

        String testContent = "========================================\n" +
                "     SMART PRINTER MONITORING SYSTEM    \n" +
                "             TEST PRINT PAGE            \n" +
                "========================================\n" +
                "Printer Name  : " + printer.getName() + "\n" +
                "Serial Number : " + (printer.getSerialNumber() != null ? printer.getSerialNumber() : "N/A") + "\n" +
                "Connection    : " + printer.getConnectionType() + "\n" +
                "IP / Port     : " + (printer.getIpAddress() != null ? printer.getIpAddress() : printer.getUsbPortName()) + "\n" +
                "Printed At    : " + LocalDateTime.now() + "\n" +
                "Requested By  : " + (printedBy != null ? printedBy : "Administrator") + "\n" +
                "========================================\n" +
                "If you can read this message, your printer is\n" +
                "functioning properly and connected to the system.\n" +
                "========================================\n\f";

        PrintJobRequest request = PrintJobRequest.builder()
                .printerId(printerId)
                .jobName("Test Page - " + printer.getName())
                .documentType("TEST_PAGE")
                .content(testContent)
                .copies(1)
                .printedBy(printedBy != null ? printedBy : "Administrator")
                .build();

        return submitPrintJob(request);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrintJobResponse> getAllPrintJobs() {
        return printJobRepository.findAllByOrderBySubmittedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrintJobResponse> getPrintJobsByPrinter(Long printerId) {
        return printJobRepository.findByPrinterIdOrderBySubmittedAtDesc(printerId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrintJobResponse getPrintJobById(Long id) {
        PrintJob job = printJobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Print job not found with id: " + id));
        return mapToResponse(job);
    }

    @Override
    public void cancelPrintJob(Long id) {
        PrintJob job = printJobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Print job not found with id: " + id));
        if (job.getStatus() == PrintJobStatus.PENDING || job.getStatus() == PrintJobStatus.PROCESSING) {
            job.setStatus(PrintJobStatus.CANCELLED);
            job.setCompletedAt(LocalDateTime.now());
            job.setErrorMessage("Job cancelled by user");
            printJobRepository.save(job);
        }
    }

    private boolean executePhysicalPrint(Printer printer, PrintJob job) {
        job.setStatus(PrintJobStatus.PROCESSING);
        printJobRepository.save(job);

        try {
            if (printer.getConnectionType() == ConnectionType.USB) {
                return printToUsbLocalPrinter(printer, job);
            } else {
                return printToNetworkPrinter(printer, job);
            }
        } catch (Exception e) {
            log.error("Hardware printing exception for job ID {}: {}", job.getId(), e.getMessage(), e);
            job.setErrorMessage(e.getMessage());
            return false;
        }
    }

    private boolean printToNetworkPrinter(Printer printer, PrintJob job) {
        String ipAddress = printer.getIpAddress();
        if (ipAddress == null || ipAddress.isBlank()) {
            job.setErrorMessage("No valid IP address specified for network printer");
            return false;
        }

        // Demo localhost bypass
        if ("127.0.0.1".equals(ipAddress) || "localhost".equals(ipAddress)) {
            log.info("Localhost loopback detected. Simulating network print job: {}", job.getJobName());
            return true;
        }

        // Try RAW TCP socket ports: 9100 (RAW JetDirect), 515 (LPR), 631 (IPP)
        int[] portsToTry = {RAW_PRINT_PORT, 515, 631};
        byte[] bytes = job.getContent().getBytes(StandardCharsets.UTF_8);

        for (int port : portsToTry) {
            log.info("Attempting RAW TCP socket print transmission to {}:{}", ipAddress, port);
            try (Socket socket = new Socket()) {
                socket.connect(new java.net.InetSocketAddress(ipAddress, port), 3000);
                socket.setSoTimeout(5000);
                try (OutputStream out = socket.getOutputStream()) {
                    for (int i = 0; i < job.getCopies(); i++) {
                        out.write(bytes);
                        out.flush();
                    }
                    log.info("Raw document bytes successfully transmitted to {}:{}", ipAddress, port);
                    return true;
                }
            } catch (Exception ex) {
                log.warn("Port {} socket print failed for IP {}: {}", port, ipAddress, ex.getMessage());
            }
        }

        // Fallback: Attempt local OS spooler print if printer installed on server host
        log.info("Network direct sockets failed. Attempting local OS spooler fallback for network printer '{}'", printer.getName());
        return printToUsbLocalPrinter(printer, job);
    }

    private boolean printToUsbLocalPrinter(Printer printer, PrintJob job) {
        String targetOsName = printer.getOsPrinterName() != null ? printer.getOsPrinterName() : printer.getName();
        log.info("Searching OS print services for USB target printer: {}", targetOsName);

        try {
            PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
            PrintService targetService = null;

            for (PrintService service : services) {
                if (service.getName().equalsIgnoreCase(targetOsName) ||
                        service.getName().toLowerCase().contains(targetOsName.toLowerCase())) {
                    targetService = service;
                    break;
                }
            }

            if (targetService == null && services.length > 0) {
                log.warn("Target OS printer '{}' not found. Falling back to default system print service.", targetOsName);
                targetService = PrintServiceLookup.lookupDefaultPrintService();
            }

            if (targetService == null) {
                job.setErrorMessage("No OS Print Service available on local machine");
                return false;
            }

            DocPrintJob docPrintJob = targetService.createPrintJob();
            byte[] bytes = job.getContent().getBytes(StandardCharsets.UTF_8);
            Doc doc = new SimpleDoc(bytes, DocFlavor.BYTE_ARRAY.AUTOSENSE, null);

            PrintRequestAttributeSet attributes = new HashPrintRequestAttributeSet();
            attributes.add(new Copies(job.getCopies()));

            docPrintJob.print(doc, attributes);
            log.info("Document sent to OS Print Service '{}' successfully", targetService.getName());
            return true;

        } catch (PrintException pe) {
            log.error("javax.print PrintException: {}", pe.getMessage(), pe);
            job.setErrorMessage("OS Print Spooler error: " + pe.getMessage());
            return false;
        } catch (Exception e) {
            log.error("USB printing error: {}", e.getMessage(), e);
            job.setErrorMessage("USB print error: " + e.getMessage());
            return false;
        }
    }

    private PrintJobResponse mapToResponse(PrintJob job) {
        return PrintJobResponse.builder()
                .id(job.getId())
                .printerId(job.getPrinter().getId())
                .printerName(job.getPrinter().getName())
                .connectionType(job.getPrinter().getConnectionType().name())
                .jobName(job.getJobName())
                .documentType(job.getDocumentType())
                .copies(job.getCopies())
                .pageCount(job.getPageCount())
                .printedBy(job.getPrintedBy())
                .status(job.getStatus())
                .submittedAt(job.getSubmittedAt())
                .completedAt(job.getCompletedAt())
                .errorMessage(job.getErrorMessage())
                .message(job.getStatus() == PrintJobStatus.COMPLETED ?
                        "Document printed successfully on " + job.getPrinter().getName() :
                        "Print job " + job.getStatus().name() + (job.getErrorMessage() != null ? ": " + job.getErrorMessage() : ""))
                .build();
    }
}
