package com.printermonitoring.repository;

import com.printermonitoring.entity.PrinterError;
import com.printermonitoring.enums.ErrorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrinterErrorRepository extends JpaRepository<PrinterError, Long> {

    List<PrinterError> findByPrinterIdOrderByDetectedAtDesc(Long printerId);

    List<PrinterError> findByStatus(ErrorStatus status);
}
