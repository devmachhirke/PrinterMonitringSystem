package com.printermonitoring.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class UserUpdateRequest {

    @NotBlank(message = "Username is required")
    @Size(max = 100, message = "Username cannot exceed 100 characters")
    private String username;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 150, message = "Email cannot exceed 150 characters")
    private String email;

    @Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters if provided")
    private String password;

    @Size(max = 150, message = "Full name cannot exceed 150 characters")
    private String fullName;

    private Boolean active;

    private Set<Long> roleIds;
}
