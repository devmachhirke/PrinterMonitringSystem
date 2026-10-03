package com.printermonitoring.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "ml_models")
@Getter
@Setter
public class MlModel extends BaseEntity {

    @Column(name = "model_name", nullable = false, length = 150)
    private String modelName;

    @Column(name = "model_type", nullable = false, length = 100)
    private String modelType;

    @Column(nullable = false, length = 50)
    private String version;

    @Column(length = 30)
    private String status;

    @Column(name = "trained_at")
    private LocalDateTime trainedAt;
}