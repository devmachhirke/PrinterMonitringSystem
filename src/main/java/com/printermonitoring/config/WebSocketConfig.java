package com.printermonitoring.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Topic destination for broadcasting to clients
        config.enableSimpleBroker("/topic");
        // Application prefix for incoming messages sent by client
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Register WebSocket endpoints with CORS allowed for local dev
        registry.addEndpoint("/ws-printer")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        registry.addEndpoint("/ws-printer")
                .setAllowedOriginPatterns("*");
    }
}
