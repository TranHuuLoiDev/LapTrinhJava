package com.evdms.evm.controller;

import com.evdms.evm.dto.LoginRequest;
import com.evdms.evm.dto.LoginResponse;
import com.evdms.evm.model.User;
import com.evdms.evm.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

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
}
