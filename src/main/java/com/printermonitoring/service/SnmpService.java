package com.printermonitoring.service;

import com.printermonitoring.dto.printer.SnmpPrinterDataResponse;

import java.util.List;

public interface SnmpService {

    /**
     * Poll a specific printer by its DB ID using SNMP v1/v2c (RFC 3805 / RFC 2790 Printer MIB).
     */
    SnmpPrinterDataResponse pollPrinterBySnmp(Long printerId);

    /**
     * Live poll any IP address with specified SNMP community (default: 'public').
     */
    SnmpPrinterDataResponse pollPrinterByIpAndCommunity(String ipAddress, String community);

    /**
     * Poll all monitored printers using SNMP.
     */
    List<SnmpPrinterDataResponse> pollAllPrintersSnmp();
}
