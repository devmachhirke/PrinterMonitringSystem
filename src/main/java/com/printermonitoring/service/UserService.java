package com.printermonitoring.service;

import com.printermonitoring.dto.user.UserRequest;
import com.printermonitoring.dto.user.UserResponse;
import com.printermonitoring.dto.user.UserUpdateRequest;

import java.util.List;
import java.util.Set;

public interface UserService {

    UserResponse createUser(UserRequest request);

    List<UserResponse> getAllUsers();

    UserResponse getUserById(Long id);

    UserResponse updateUser(Long id, UserUpdateRequest request);

    void deleteUser(Long id);

    UserResponse assignRolesToUser(Long userId, Set<Long> roleIds);
}
