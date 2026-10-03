package com.printermonitoring.controller;

import com.printermonitoring.dto.user.UserRequest;
import com.printermonitoring.dto.user.UserResponse;
import com.printermonitoring.dto.user.UserUpdateRequest;
import com.printermonitoring.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "User Management", description = "APIs for managing users and role assignments")
public class UserController {

    private final UserService userService;

    // CREATE USER
    @PostMapping
    @Operation(summary = "Create a new user")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRequest request) {
        UserResponse response = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ALL USERS
    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // GET USER BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // UPDATE USER
    @PutMapping("/{id}")
    @Operation(summary = "Update user details by ID")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    // DELETE USER
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete user by ID")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ASSIGN ROLES TO USER
    @PutMapping("/{id}/roles")
    @Operation(summary = "Assign or update roles for a user")
    public ResponseEntity<UserResponse> assignRolesToUser(
            @PathVariable Long id,
            @RequestBody Set<Long> roleIds) {
        UserResponse response = userService.assignRolesToUser(id, roleIds);
        return ResponseEntity.ok(response);
    }
}
