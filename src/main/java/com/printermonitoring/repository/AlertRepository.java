package com.printermonitoring.repository;

import com.printermonitoring.entity.Alert;
import com.printermonitoring.enums.AlertSeverity;
import com.printermonitoring.enums.AlertStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByPrinterIdOrderByCreatedAtDesc(Long printerId);

    List<Alert> findByStatus(AlertStatus status);

    List<Alert> findBySeverity(AlertSeverity severity);

    List<Alert> findByPrinterIdAndStatus(Long printerId, AlertStatus status);
}
