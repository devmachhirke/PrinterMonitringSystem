package com.printermonitoring.repository;

import com.printermonitoring.entity.PrinterLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrinterLocationRepository
        extends JpaRepository<PrinterLocation, Long> {

}