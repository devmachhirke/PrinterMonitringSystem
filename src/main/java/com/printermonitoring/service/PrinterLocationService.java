package com.printermonitoring.service;

import com.printermonitoring.dto.location.PrinterLocationRequest;
import com.printermonitoring.dto.location.PrinterLocationResponse;

import java.util.List;

public interface PrinterLocationService {

    PrinterLocationResponse createLocation(PrinterLocationRequest request);

    List<PrinterLocationResponse> getAllLocations();

    PrinterLocationResponse getLocationById(Long id);

    PrinterLocationResponse updateLocation(Long id, PrinterLocationRequest request);

    void deleteLocation(Long id);
}
