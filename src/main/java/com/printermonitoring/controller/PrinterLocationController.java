package com.printermonitoring.controller;

import com.printermonitoring.dto.location.PrinterLocationRequest;
import com.printermonitoring.dto.location.PrinterLocationResponse;
import com.printermonitoring.service.PrinterLocationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
@Tag(name = "Printer Location Management", description = "APIs for managing physical printer locations")
public class PrinterLocationController {

    private final PrinterLocationService locationService;

    // CREATE LOCATION
    @PostMapping
    @Operation(summary = "Create a new printer location")
    public ResponseEntity<PrinterLocationResponse> createLocation(@Valid @RequestBody PrinterLocationRequest request) {
        PrinterLocationResponse response = locationService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ALL LOCATIONS
    @GetMapping
    @Operation(summary = "Get all printer locations")
    public ResponseEntity<List<PrinterLocationResponse>> getAllLocations() {
        List<PrinterLocationResponse> locations = locationService.getAllLocations();
        return ResponseEntity.ok(locations);
    }

    // GET LOCATION BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get printer location by ID")
    public ResponseEntity<PrinterLocationResponse> getLocationById(@PathVariable Long id) {
        PrinterLocationResponse location = locationService.getLocationById(id);
        return ResponseEntity.ok(location);
    }

    // UPDATE LOCATION
    @PutMapping("/{id}")
    @Operation(summary = "Update printer location by ID")
    public ResponseEntity<PrinterLocationResponse> updateLocation(
            @PathVariable Long id,
            @Valid @RequestBody PrinterLocationRequest request) {
        PrinterLocationResponse updatedLocation = locationService.updateLocation(id, request);
        return ResponseEntity.ok(updatedLocation);
    }

    // DELETE LOCATION
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete printer location by ID")
    public ResponseEntity<Void> deleteLocation(@PathVariable Long id) {
        locationService.deleteLocation(id);
        return ResponseEntity.noContent().build();
    }
}
