package com.printermonitoring.service;

import com.printermonitoring.dto.auth.AuthRequest;
import com.printermonitoring.dto.auth.AuthResponse;
import com.printermonitoring.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse login(AuthRequest request);
    AuthResponse register(RegisterRequest request);
}
