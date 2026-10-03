package com.printermonitoring.service;

import com.printermonitoring.dto.printer.UsbPrinterInfoResponse;

import java.util.List;

public interface UsbPrinterDetectionService {

    List<UsbPrinterInfoResponse> detectLocalUsbPrinters();
}
