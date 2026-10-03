package com.printermonitoring.service.impl;

import com.printermonitoring.dto.printer.UsbPrinterInfoResponse;
import com.printermonitoring.service.UsbPrinterDetectionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.print.PrintService;
import javax.print.PrintServiceLookup;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class UsbPrinterDetectionServiceImpl implements UsbPrinterDetectionService {

    @Override
    public List<UsbPrinterInfoResponse> detectLocalUsbPrinters() {
        List<UsbPrinterInfoResponse> detectedPrinters = new ArrayList<>();

        try {
            PrintService defaultService = PrintServiceLookup.lookupDefaultPrintService();
            String defaultName = (defaultService != null) ? defaultService.getName() : "";

            PrintService[] services = PrintServiceLookup.lookupPrintServices(null, null);
            log.info("Scanning OS local print services... Found {} printers.", services.length);

            for (PrintService service : services) {
                String printerName = service.getName();
                boolean isDefault = printerName.equalsIgnoreCase(defaultName);

                detectedPrinters.add(
                        UsbPrinterInfoResponse.builder()
                                .name(printerName)
                                .isDefault(isDefault)
                                .isAvailable(true)
                                .build()
                );
            }
        } catch (Exception e) {
            log.error("Error detecting local OS USB printers via Java Print Service API", e);
        }

        return detectedPrinters;
    }
}
