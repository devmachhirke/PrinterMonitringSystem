package com.printermonitoring.controller;

import com.printermonitoring.dto.printer.SnmpPrinterDataResponse;
import com.printermonitoring.service.SnmpService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/snmp")
@RequiredArgsConstructor
@Tag(name = "SNMP Monitoring", description = "Live SNMP polling APIs for RFC 3805 / RFC 2790 Printer MIBs")
public class SnmpController {

    private final SnmpService snmpService;

    @Operation(summary = "Poll specific printer via SNMP by ID")
    @GetMapping("/poll/{printerId}")
    public ResponseEntity<SnmpPrinterDataResponse> pollPrinterBySnmp(@PathVariable Long printerId) {
        return ResponseEntity.ok(snmpService.pollPrinterBySnmp(printerId));
    }

    @Operation(summary = "Poll all monitored network printers via SNMP")
    @GetMapping("/poll-all")
    public ResponseEntity<List<SnmpPrinterDataResponse>> pollAllPrintersSnmp() {
        return ResponseEntity.ok(snmpService.pollAllPrintersSnmp());
    }

    @Operation(summary = "Live test SNMP query against any IP address")
    @GetMapping("/poll-ip")
    public ResponseEntity<SnmpPrinterDataResponse> pollByIp(
            @RequestParam String ipAddress,
            @RequestParam(defaultValue = "public") String community) {
        return ResponseEntity.ok(snmpService.pollPrinterByIpAndCommunity(ipAddress, community));
    }
}
