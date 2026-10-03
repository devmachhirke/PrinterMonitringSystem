package com.printermonitoring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "printer_models")
@Getter
@Setter
public class PrinterModel extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String manufacturer;

    @Column(name = "model_name", nullable = false, length = 150)
    private String modelName;

    @Column(name = "supports_snmp")
    private Boolean supportsSnmp = true;

    @Column(name = "supports_toner")
    private Boolean supportsToner = false;

    @Column(name = "supports_page_count")
    private Boolean supportsPageCount = false;

    @Column(name = "supports_paper_status")
    private Boolean supportsPaperStatus = false;
}