package com.printermonitoring.repository;

import com.printermonitoring.entity.PrintJob;
import com.printermonitoring.enums.PrintJobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrintJobRepository extends JpaRepository<PrintJob, Long> {
    List<PrintJob> findByPrinterIdOrderBySubmittedAtDesc(Long printerId);
    List<PrintJob> findByStatus(PrintJobStatus status);
    List<PrintJob> findAllByOrderBySubmittedAtDesc();
}
