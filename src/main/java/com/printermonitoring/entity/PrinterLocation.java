package com.printermonitoring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "printer_locations")
@Getter
@Setter
public class PrinterLocation extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 150)
    private String building;

    @Column(length = 50)
    private String floor;

    @Column(length = 150)
    private String department;
}