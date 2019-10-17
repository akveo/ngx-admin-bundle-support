/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Personal / Commercial License.
 * See LICENSE_PERSONAL / LICENSE_COMMERCIAL in the project root for license information on type of purchased license.
 */

package com.akveo.bundlejava.authentication;

import com.akveo.bundlejava.authentication.exception.PasswordsDontMatchException;
import com.akveo.bundlejava.authentication.resetpassword.RequestPasswordService;
import com.akveo.bundlejava.authentication.resetpassword.ResetPasswordService;
import com.akveo.bundlejava.authentication.resetpassword.RestorePasswordDTO;
import com.akveo.bundlejava.authentication.resetpassword.RestorePasswordService;
import com.akveo.bundlejava.authentication.resetpassword.RequestPasswordDTO;
import com.akveo.bundlejava.authentication.resetpassword.ResetPasswordDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.validation.Valid;

import static org.springframework.http.ResponseEntity.ok;

/**
 * Controller which provides functionality for authentication
 */
@Controller
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final RequestPasswordService requestPasswordService;
    private final RestorePasswordService restorePasswordService;
    private final ResetPasswordService resetPasswordService;

    @Autowired
    public AuthController(AuthService authService,
                          RequestPasswordService requestPasswordService,
                          RestorePasswordService restorePasswordService,
                          ResetPasswordService resetPasswordService) {
        this.authService = authService;
        this.requestPasswordService = requestPasswordService;
        this.restorePasswordService = restorePasswordService;
        this.resetPasswordService = resetPasswordService;
    }

    /**
     * Login user
     * @param loginDTO user credentials
     * @return generated token
     */
    @PostMapping("/login")
    public ResponseEntity login(@Valid @RequestBody LoginDTO loginDTO) {
        Tokens tokens = authService.login(loginDTO);
        return toResponse(tokens);
    }

    /**
     * Restore password
     * @param restorePasswordDTO new password with token
     * @return result message
     */
    @PostMapping("/restore-pass")
    public ResponseEntity restorePassword(@Valid @RequestBody RestorePasswordDTO restorePasswordDTO) {
        if (!restorePasswordDTO.getNewPassword().equals(restorePasswordDTO.getConfirmPassword())) {
            throw new PasswordsDontMatchException();
        }

        restorePasswordService.restorePassword(restorePasswordDTO);
        return ok("Password was restored");
    }

    /**
     * Sign up
     * @param signUpDTO sign up user data
     * @return token
     */
    @PostMapping("/sign-up")
    public ResponseEntity register(@Valid @RequestBody SignUpDTO signUpDTO) {
        if (!signUpDTO.getPassword().equals(signUpDTO.getConfirmPassword())) {
            throw new PasswordsDontMatchException();
        }

        Tokens tokens = authService.register(signUpDTO);
        return toResponse(tokens);
    }

    /**
     * Request password. Generate link for restoring password which should be sent via email
     * @param requestPasswordDTO object with user email
     * @return result message
     */
    @PostMapping("/request-pass")
    public ResponseEntity requestPassword(@Valid @RequestBody RequestPasswordDTO requestPasswordDTO) {
        requestPasswordService.requestPassword(requestPasswordDTO);
        return ok("Ok");
    }

    /**
     * Sign out. Perform any required actions to log out user, like invalidate user session.
     * Implement your required logic
     * @return result message
     */
    @PostMapping("/sign-out")
    public ResponseEntity logout() {
        return ok("Ok");
    }

    /**
     * Reset password for signed in user
     * @param resetPasswordDTO new and confirmed passwords
     * @return result message
     */
    @PostMapping("/reset-pass")
    public ResponseEntity resetPassword(@RequestBody ResetPasswordDTO resetPasswordDTO) {
        if (!resetPasswordDTO.getConfirmPassword().equals(resetPasswordDTO.getPassword())) {
            throw new PasswordsDontMatchException();
        }

        resetPasswordService.resetPassword(resetPasswordDTO);
        return ok("Password was reset");
    }

    /**
     * Refresh token
     * @param refreshTokenDTO refresh token
     * @return new token
     */
    @PostMapping("/refresh-token")
    public ResponseEntity<RefreshTokenDTO> refreshToken(@Valid @RequestBody RefreshTokenDTO refreshTokenDTO) {
        Tokens tokens = authService.refreshToken(refreshTokenDTO);
        return toResponse(tokens);
    }

    private ResponseEntity<RefreshTokenDTO> toResponse(Tokens tokens) {
        return ok(new RefreshTokenDTO(tokens));
    }
}
