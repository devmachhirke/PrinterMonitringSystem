package com.printermonitoring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PrintermonitoringApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrintermonitoringApplication.class, args);
	}

}
