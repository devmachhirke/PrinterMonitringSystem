package com.printermonitoring.controller;

import com.printermonitoring.dto.print.PrintJobRequest;
import com.printermonitoring.dto.print.PrintJobResponse;
import com.printermonitoring.service.PrintJobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/print-jobs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
@Tag(name = "Print Execution Management", description = "APIs for submitting and managing paper print jobs across network and USB printers")
public class PrintJobController {

    private final PrintJobService printJobService;

    // SUBMIT NEW PRINT JOB
    @PostMapping("/submit")
    @Operation(summary = "Submit a document print job to a network or USB printer")
    public ResponseEntity<PrintJobResponse> submitPrintJob(
            @Valid @RequestBody PrintJobRequest request) {
        PrintJobResponse response = printJobService.submitPrintJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // PRINT TEST PAGE
    @PostMapping("/test-page/{printerId}")
    @Operation(summary = "Print a system diagnostic test page on the specified printer")
    public ResponseEntity<PrintJobResponse> printTestPage(
            @PathVariable Long printerId,
            @RequestParam(required = false, defaultValue = "System Admin") String printedBy) {
        PrintJobResponse response = printJobService.printTestPage(printerId, printedBy);
        return ResponseEntity.ok(response);
    }

    // GET ALL PRINT JOBS
    @GetMapping
    @Operation(summary = "Get all submitted print jobs history")
    public ResponseEntity<List<PrintJobResponse>> getAllPrintJobs() {
        List<PrintJobResponse> jobs = printJobService.getAllPrintJobs();
        return ResponseEntity.ok(jobs);
    }

    // GET JOBS FOR A SPECIFIC PRINTER
    @GetMapping("/printer/{printerId}")
    @Operation(summary = "Get print job history for a specific printer")
    public ResponseEntity<List<PrintJobResponse>> getJobsByPrinter(
            @PathVariable Long printerId) {
        List<PrintJobResponse> jobs = printJobService.getPrintJobsByPrinter(printerId);
        return ResponseEntity.ok(jobs);
    }

    // GET BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get print job status by ID")
    public ResponseEntity<PrintJobResponse> getJobById(
            @PathVariable Long id) {
        PrintJobResponse job = printJobService.getPrintJobById(id);
        return ResponseEntity.ok(job);
    }

    // CANCEL JOB
    @PostMapping("/{id}/cancel")
    @Operation(summary = "Cancel a pending or processing print job")
    public ResponseEntity<Void> cancelJob(
            @PathVariable Long id) {
        printJobService.cancelPrintJob(id);
        return ResponseEntity.noContent().build();
    }
}
