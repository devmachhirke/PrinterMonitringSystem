package com.printermonitoring.service.impl;

import com.printermonitoring.dto.auth.AuthRequest;
import com.printermonitoring.dto.auth.AuthResponse;
import com.printermonitoring.dto.auth.RegisterRequest;
import com.printermonitoring.entity.Role;
import com.printermonitoring.entity.User;
import com.printermonitoring.repository.RoleRepository;
import com.printermonitoring.repository.UserRepository;
import com.printermonitoring.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .or(() -> userRepository.findByEmail(request.getUsername()))
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        if (Boolean.FALSE.equals(user.getActive())) {
            throw new RuntimeException("User account is deactivated");
        }

        Set<String> roleNames = user.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        if (roleNames.isEmpty()) {
            roleNames.add("ROLE_VIEWER");
        }

        String simulatedToken = "jwt-" + UUID.randomUUID().toString();

        return AuthResponse.builder()
                .token(simulatedToken)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(roleNames)
                .message("Login successful")
                .build();
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setActive(true);

        String roleName = request.getRole() != null ? request.getRole().toUpperCase() : "VIEWER";
        if (!roleName.startsWith("ROLE_")) {
            roleName = "ROLE_" + roleName;
        }

        String finalRoleName = roleName;
        Role role = roleRepository.findByName(finalRoleName)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(finalRoleName);
                    return roleRepository.save(newRole);
                });

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        user.setRoles(roles);

        User savedUser = userRepository.save(user);

        Set<String> roleNames = savedUser.getRoles()
                .stream()
                .map(Role::getName)
                .collect(Collectors.toSet());

        String simulatedToken = "jwt-" + UUID.randomUUID().toString();

        return AuthResponse.builder()
                .token(simulatedToken)
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .fullName(savedUser.getFullName())
                .roles(roleNames)
                .message("Registration successful")
                .build();
    }
}
