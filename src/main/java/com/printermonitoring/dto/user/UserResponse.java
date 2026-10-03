package com.printermonitoring.dto.user;

import com.printermonitoring.dto.role.RoleResponse;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Builder
public class UserResponse {

    private Long id;

    private String username;

    private String email;

    private String fullName;

    private Boolean active;

    private Set<RoleResponse> roles;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
