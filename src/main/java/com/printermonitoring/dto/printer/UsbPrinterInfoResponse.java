package com.printermonitoring.dto.printer;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UsbPrinterInfoResponse {

    private String name;

    private Boolean isDefault;

    private Boolean isAvailable;
}
