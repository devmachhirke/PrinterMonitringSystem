package com.printermonitoring.service;

import com.printermonitoring.dto.toner.TonerStatusRequest;
import com.printermonitoring.dto.toner.TonerStatusResponse;

import java.util.List;

public interface TonerStatusService {
    TonerStatusResponse recordTonerStatus(TonerStatusRequest request);
    List<TonerStatusResponse> getTonerStatusesByPrinter(Long printerId);
    List<TonerStatusResponse> getAllTonerStatuses();
    TonerStatusResponse getTonerStatusById(Long id);
    void deleteTonerStatus(Long id);
}
