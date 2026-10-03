package com.printermonitoring.repository;

import com.printermonitoring.entity.PrinterStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PrinterStatusHistoryRepository extends JpaRepository<PrinterStatusHistory, Long> {

    List<PrinterStatusHistory> findTop50ByPrinterIdOrderByCheckedAtDesc(Long printerId);
}
