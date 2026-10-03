package com.printermonitoring.repository;

import com.printermonitoring.entity.PrinterModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrinterModelRepository
        extends JpaRepository<PrinterModel, Long> {

}