package com.printermonitoring.repository;

import com.printermonitoring.entity.PrinterUsage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrinterUsageRepository extends JpaRepository<PrinterUsage, Long> {

    List<PrinterUsage> findByPrinterIdOrderByCollectedAtDesc(Long printerId);

    List<PrinterUsage> findTop20ByPrinterIdOrderByCollectedAtDesc(Long printerId);
}
