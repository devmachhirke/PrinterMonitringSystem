package com.printermonitoring.repository;

import com.printermonitoring.entity.PaperStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaperStatusRepository extends JpaRepository<PaperStatus, Long> {

    List<PaperStatus> findByPrinterIdOrderByCollectedAtDesc(Long printerId);

    List<PaperStatus> findTop20ByPrinterIdOrderByCollectedAtDesc(Long printerId);
}
