package com.printermonitoring.controller;

import com.printermonitoring.dto.role.RoleRequest;
import com.printermonitoring.dto.role.RoleResponse;
import com.printermonitoring.service.RoleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
@Tag(name = "Role Management", description = "APIs for managing user roles")
public class RoleController {

    private final RoleService roleService;

    // CREATE ROLE
    @PostMapping
    @Operation(summary = "Create a new role")
    public ResponseEntity<RoleResponse> createRole(@Valid @RequestBody RoleRequest request) {
        RoleResponse response = roleService.createRole(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET ALL ROLES
    @GetMapping
    @Operation(summary = "Get all roles")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        List<RoleResponse> roles = roleService.getAllRoles();
        return ResponseEntity.ok(roles);
    }

    // GET ROLE BY ID
    @GetMapping("/{id}")
    @Operation(summary = "Get role by ID")
    public ResponseEntity<RoleResponse> getRoleById(@PathVariable Long id) {
        RoleResponse role = roleService.getRoleById(id);
        return ResponseEntity.ok(role);
    }

    // UPDATE ROLE
    @PutMapping("/{id}")
    @Operation(summary = "Update role by ID")
    public ResponseEntity<RoleResponse> updateRole(
            @PathVariable Long id,
            @Valid @RequestBody RoleRequest request) {
        RoleResponse updatedRole = roleService.updateRole(id, request);
        return ResponseEntity.ok(updatedRole);
    }

    // DELETE ROLE
    @DeleteMapping("/{id}")
    @Operation(summary = "Delete role by ID")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}
