package com.evdms.evm.controller;

import com.evdms.common.dto.AuthRequest;
import com.evdms.common.dto.AuthResponse;
import com.evdms.evm.model.User;
import com.evdms.evm.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        try {
            AuthResponse response = authService.login(authRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Login failed", e.getMessage()));
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(
                    registerRequest.getUsername(),
                    registerRequest.getPassword(),
                    registerRequest.getFullName(),
                    registerRequest.getRole(),
                    registerRequest.getDealerId()
            );
            return ResponseEntity.ok(new SuccessResponse("Registration successful", user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Registration failed", e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String bearerToken) {
        try {
            String username = extractUsernameFromToken(bearerToken);
            User user = authService.getUserByUsername(username);
            return ResponseEntity.ok(new SuccessResponse("Success", user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse("Failed", e.getMessage()));
        }
    }
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody ChangePasswordRequest request) {
        try {

            String username = extractUsernameFromToken(bearerToken);
            User user = authService.getUserByUsername(username);
            
            authService.changePassword(user.getUserId(), request.getOldPassword(), request.getNewPassword());
            return ResponseEntity.ok(new SuccessResponse("Password changed", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Failed to change password", e.getMessage()));
        }
    }
    private String extractUsernameFromToken(String bearerToken) throws Exception {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        throw new Exception("Invalid token");
    }

    public static class RegisterRequest {
        private String username;
        private String password;
        private String fullName;
        private String role;
        private Long dealerId;

        public RegisterRequest() {}

        public RegisterRequest(String username, String password, String fullName, String role, Long dealerId) {
            this.username = username;
            this.password = password;
            this.fullName = fullName;
            this.role = role;
            this.dealerId = dealerId;
        }

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }

        public Long getDealerId() { return dealerId; }
        public void setDealerId(Long dealerId) { this.dealerId = dealerId; }
    }

    public static class ChangePasswordRequest {
        private String oldPassword;
        private String newPassword;

        public ChangePasswordRequest() {}

        public ChangePasswordRequest(String oldPassword, String newPassword) {
            this.oldPassword = oldPassword;
            this.newPassword = newPassword;
        }

        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }

        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    public static class SuccessResponse {
        private String message;
        private Object data;

        public SuccessResponse() {}

        public SuccessResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public Object getData() { return data; }
        public void setData(Object data) { this.data = data; }
    }

    public static class ErrorResponse {
        private String error;
        private String message;

        public ErrorResponse() {}

        public ErrorResponse(String error, String message) {
            this.error = error;
            this.message = message;
        }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
