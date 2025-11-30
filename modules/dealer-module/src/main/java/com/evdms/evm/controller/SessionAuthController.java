package com.evdms.evm.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.evdms.evm.dto.LoginRequest;
import com.evdms.evm.dto.LoginResponse;
import com.evdms.evm.model.User;
import com.evdms.evm.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/session")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
@RequiredArgsConstructor
public class SessionAuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Map database role format to frontend format
     * 'Admin' → 'ADMIN'
     * 'EVM Staff' → 'EVM_STAFF'
     * 'Dealer Manager' → 'DEALER_MANAGER'
     * 'Dealer Staff' → 'DEALER_STAFF'
     */
    private String mapDatabaseRoleToFrontend(String dbRole) {
        if (dbRole == null) return null;
        return dbRole.replace(" ", "_").toUpperCase();
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest, HttpSession session) {
        // Tìm user theo username
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        
        if (userOpt.isEmpty()) {
            return ResponseEntity.ok(new LoginResponse(false, "Invalid username or password", null));
        }

        User user = userOpt.get();

        // Kiểm tra user có active không
        if (!user.getIsActive()) {
            return ResponseEntity.ok(new LoginResponse(false, "Account is inactive", null));
        }

        // Kiểm tra password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.ok(new LoginResponse(false, "Invalid username or password", null));
        }

        // Map database role sang frontend format
        // 'Admin' → 'ADMIN', 'EVM Staff' → 'EVM_STAFF', etc.
        String frontendRole = mapDatabaseRoleToFrontend(user.getRole());
        
        // Tạo UserInfo để trả về
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            user.getUserId(),
            user.getUsername(),
            user.getFullName(),
            frontendRole,
            user.getDealerId()
        );

        // Lưu vào session (lưu cả 2 format)
        session.setAttribute("userId", user.getUserId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("fullName", user.getFullName());
        session.setAttribute("role", frontendRole); // Frontend format
        session.setAttribute("dealerId", user.getDealerId());
        session.setMaxInactiveInterval(3600); // 1 hour

        return ResponseEntity.ok(new LoginResponse(true, "Login successful", userInfo));
    }

    @PostMapping("/logout")
    public ResponseEntity<LoginResponse> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(new LoginResponse(true, "Logged out successfully", null));
    }

    @GetMapping("/check")
    public ResponseEntity<LoginResponse> checkSession(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.ok(new LoginResponse(false, "No active session", null));
        }
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            userId,
            (String) session.getAttribute("username"),
            (String) session.getAttribute("fullName"),
            (String) session.getAttribute("role"),
            (Long) session.getAttribute("dealerId")
        );
        
        return ResponseEntity.ok(new LoginResponse(true, "Session active", userInfo));
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }
        
        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo(
            userId,
            (String) session.getAttribute("username"),
            (String) session.getAttribute("fullName"),
            (String) session.getAttribute("role"),
            (Long) session.getAttribute("dealerId")
        );
        
        return ResponseEntity.ok(userInfo);
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @RequestBody ChangePasswordRequest request,
            HttpSession session) {
        
        Long userId = (Long) session.getAttribute("userId");
        
        if (userId == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        // Tìm user
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User user = userOpt.get();

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(400).body("Mật khẩu hiện tại không đúng");
        }

        // Kiểm tra mật khẩu mới không trùng mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(400).body("Mật khẩu mới phải khác mật khẩu hiện tại");
        }

        // Cập nhật mật khẩu mới
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        // Invalidate session để user phải login lại
        session.invalidate();

        return ResponseEntity.ok("Đổi mật khẩu thành công");
    }

    @PostMapping("/admin/reset-password")
    public ResponseEntity<String> adminResetPassword(
            @RequestBody AdminResetPasswordRequest request,
            HttpSession session) {
        
        // Check if current user is admin
        String role = (String) session.getAttribute("role");
        
        if (role == null || (!role.equals("ADMIN") && !role.equals("Admin"))) {
            return ResponseEntity.status(403).body("Chỉ Admin mới có quyền reset mật khẩu");
        }

        // Find target user
        Long userId = request.getUserId();
        if (userId == null) {
            return ResponseEntity.status(400).body("User ID không được để trống");
        }
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy người dùng");
        }

        User user = userOpt.get();

        // Validate new password
        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            return ResponseEntity.status(400).body("Mật khẩu mới phải có tối thiểu 6 ký tự");
        }

        // Reset password (no need to check old password)
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Reset mật khẩu thành công cho user: " + user.getUsername());
    }

    // DTO for change password request
    public static class ChangePasswordRequest {
        private String currentPassword;
        private String newPassword;

        public String getCurrentPassword() { return currentPassword; }
        public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    // DTO for admin reset password request
    public static class AdminResetPasswordRequest {
        private Long userId;
        private String newPassword;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}
