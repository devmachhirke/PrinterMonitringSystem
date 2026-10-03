package com.printermonitoring.dto.printer;

import com.printermonitoring.enums.PrinterStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SnmpPrinterDataResponse {

    private Long printerId;
    private String printerName;
    private String ipAddress;
    private PrinterStatus status;
    private String sysDescr;
    private String sysUpTime;
    private String hrPrinterStatus;
    private String hrDetectedErrorState;
    private Long pageCount;
    private Integer blackTonerPercent;
    private Integer cyanTonerPercent;
    private Integer magentaTonerPercent;
    private Integer yellowTonerPercent;
    private Integer paperLevelPercent;
    private boolean snmpReachable;
    private LocalDateTime polledAt;
    private String message;
}
