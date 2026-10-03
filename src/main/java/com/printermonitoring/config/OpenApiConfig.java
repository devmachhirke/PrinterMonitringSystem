package com.printermonitoring.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Smart Printer Monitoring System API")
                        .version("1.0.0")
                        .description("REST API documentation for Smart Printer Monitoring System including Printer, User, and Role management.")
                        .contact(new Contact()
                                .name("Smart Printer Team")));
    }
}
