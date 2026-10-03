package com.printermonitoring.service;

import com.printermonitoring.dto.role.RoleRequest;
import com.printermonitoring.dto.role.RoleResponse;

import java.util.List;

public interface RoleService {

    RoleResponse createRole(RoleRequest request);

    List<RoleResponse> getAllRoles();

    RoleResponse getRoleById(Long id);

    RoleResponse updateRole(Long id, RoleRequest request);

    void deleteRole(Long id);
}
