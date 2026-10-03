package com.printermonitoring.repository;

import com.printermonitoring.entity.MaintenanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRecordRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByPrinterIdOrderByMaintenanceDateDesc(Long printerId);

    List<MaintenanceRecord> findByPerformedById(Long userId);
}
