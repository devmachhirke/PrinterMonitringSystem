package com.printermonitoring.repository;

import com.printermonitoring.entity.TonerStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TonerStatusRepository extends JpaRepository<TonerStatus, Long> {

    List<TonerStatus> findByPrinterIdOrderByCollectedAtDesc(Long printerId);

    List<TonerStatus> findTop20ByPrinterIdOrderByCollectedAtDesc(Long printerId);
}
