package com.printermonitoring.service;

import com.printermonitoring.dto.paper.PaperStatusRequest;
import com.printermonitoring.dto.paper.PaperStatusResponse;

import java.util.List;

public interface PaperStatusService {
    PaperStatusResponse recordPaperStatus(PaperStatusRequest request);
    List<PaperStatusResponse> getPaperStatusesByPrinter(Long printerId);
    List<PaperStatusResponse> getAllPaperStatuses();
    PaperStatusResponse getPaperStatusById(Long id);
    void deletePaperStatus(Long id);
}
