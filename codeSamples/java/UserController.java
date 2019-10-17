/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

package com.akveo.bundlejava.user;

import com.akveo.bundlejava.image.Image;
import com.akveo.bundlejava.user.filter.UsersGridFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import javax.validation.Valid;

import static org.springframework.http.ResponseEntity.ok;
/**
 * Controller for managing users
 */
@Controller
@RequestMapping("/users")
public class UserController {

    private UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<GridData<UserDTO>> getDataForGrid(UsersGridFilter usersGridFilter) {
        usersGridFilter = usersGridFilter == null ? new UsersGridFilter() : usersGridFilter;
        return ok(userService.getDataForGrid(usersGridFilter));
    }

    /**
     * Get user. Allowed only for Admin
     * @param id user id
     * @return user
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity getUser(@PathVariable Long id) {
        return ok(userService.getUserById(id));
    }

    /**
     * Update user. Allowed only for Admin
     * @param id user id
     * @param userDTO updated user data
     * @return updated user data
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity updateUser(@PathVariable Long id, @Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateUserById(id, userDTO);
        return ok(updatedUser);
    }

    /**
     * Delete user
     * @param id user id
     * @return boolean result
     */
    @DeleteMapping("/{id}")
    public ResponseEntity deleteUser(@PathVariable Long id) {
        return ok(userService.deleteUser(id));
    }

    /**
     * Get current user
     * @return current user data
     */
    @GetMapping("/current")
    public ResponseEntity getCurrentUser() {
        return ok(userService.getCurrentUser());
    }

    /**
     * Update current user
     * @param userDTO updated user data
     * @return updated user data
     */
    @PutMapping("/current")
    public ResponseEntity updateCurrentUser(@Valid @RequestBody UserDTO userDTO) {
        UserDTO updatedUser = userService.updateCurrentUser(userDTO);
        return ok(updatedUser);
    }

    /**
     * Create user. Allowed only for Admin
     * @param userDTO new user data
     * @return created user
     */
    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("")
    public ResponseEntity createUser(@Valid @RequestBody UserDTO userDTO) {
        return ok(userService.createUser(userDTO));
    }

    /**
     * Update current user image
     *
     * @param baseString updated user image
     * @return updated image
     */
    @PutMapping("/{id}/photo")
    public ResponseEntity updateUserImage(@PathVariable Long id, @Valid @RequestBody String baseString) {
        Image image = userService.updateUserImageById(id, baseString);
        return ok(image);
    }

    /**
     * Get user image by id
     *
     * @param id user image id
     * @return user image
     */
    @GetMapping("/{id}/photo")
    public ResponseEntity<byte[]> getUserImage(@PathVariable Long id, @RequestParam String token) {
        Image image = userService.getImageById(id, token);
        byte[] imageBytes = image.getImageBytes();
        return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
    }

}
