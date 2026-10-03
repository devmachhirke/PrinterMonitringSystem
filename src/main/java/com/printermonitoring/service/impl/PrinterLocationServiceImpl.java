package com.printermonitoring.service.impl;

import com.printermonitoring.dto.location.PrinterLocationRequest;
import com.printermonitoring.dto.location.PrinterLocationResponse;
import com.printermonitoring.entity.PrinterLocation;
import com.printermonitoring.repository.PrinterLocationRepository;
import com.printermonitoring.service.PrinterLocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PrinterLocationServiceImpl implements PrinterLocationService {

    private final PrinterLocationRepository locationRepository;

    @Override
    public PrinterLocationResponse createLocation(PrinterLocationRequest request) {
        PrinterLocation location = new PrinterLocation();
        location.setName(request.getName());
        location.setBuilding(request.getBuilding());
        location.setFloor(request.getFloor());
        location.setDepartment(request.getDepartment());

        PrinterLocation savedLocation = locationRepository.save(location);
        return mapToResponse(savedLocation);
    }

    @Override
    @Transactional(readOnly = true)
    public List<PrinterLocationResponse> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PrinterLocationResponse getLocationById(Long id) {
        PrinterLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer location not found with id: " + id));

        return mapToResponse(location);
    }

    @Override
    public PrinterLocationResponse updateLocation(Long id, PrinterLocationRequest request) {
        PrinterLocation location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Printer location not found with id: " + id));

        location.setName(request.getName());
        location.setBuilding(request.getBuilding());
        location.setFloor(request.getFloor());
        location.setDepartment(request.getDepartment());

        PrinterLocation updatedLocation = locationRepository.save(location);
        return mapToResponse(updatedLocation);
    }

    @Override
    public void deleteLocation(Long id) {
        if (!locationRepository.existsById(id)) {
            throw new RuntimeException("Printer location not found with id: " + id);
        }

        locationRepository.deleteById(id);
    }

    private PrinterLocationResponse mapToResponse(PrinterLocation location) {
        return PrinterLocationResponse.builder()
                .id(location.getId())
                .name(location.getName())
                .building(location.getBuilding())
                .floor(location.getFloor())
                .department(location.getDepartment())
                .createdAt(location.getCreatedAt())
                .updatedAt(location.getUpdatedAt())
                .build();
    }
}
