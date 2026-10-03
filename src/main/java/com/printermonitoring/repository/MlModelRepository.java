package com.printermonitoring.repository;

import com.printermonitoring.entity.MlModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MlModelRepository extends JpaRepository<MlModel, Long> {

    List<MlModel> findByStatus(String status);

    List<MlModel> findByModelType(String modelType);
}
