package com.evdms.evm.service;

import com.evdms.common.dto.AuthRequest;
import com.evdms.common.dto.AuthResponse;
import com.evdms.common.security.JwtTokenProvider;
import com.evdms.evm.model.User;
import com.evdms.evm.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@SuppressWarnings("null")
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository,
                       JwtTokenProvider jwtTokenProvider,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtTokenProvider = jwtTokenProvider;
        this.passwordEncoder = passwordEncoder;
    }
    public AuthResponse login(AuthRequest authRequest) throws Exception {
        Optional<User> userOptional = userRepository.findByUsername(authRequest.getUsername());
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found!");
        }
        
        User user = userOptional.get();
        
                if (!user.getIsActive()) {
            throw new Exception("User is inactive");
        }
        
        if (!passwordEncoder.matches(authRequest.getPassword(), user.getPasswordHash())) {
            throw new Exception("Incorrect password");
        }

        String token = jwtTokenProvider.generateToken(
                user.getUsername(),
                user.getRole(),
                user.getUserId(),
                user.getDealerId()
        );

        String refreshToken = jwtTokenProvider.generateRefreshToken(user.getUsername());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .expiresIn(jwtTokenProvider.getTokenExpiration())
                .username(user.getUsername())
                .role(user.getRole())
                .userId(user.getUserId())
                .dealerId(user.getDealerId())
                .build();
    }
    public User register(String username, String password, String fullName, String role, Long dealerId) throws Exception {
                if (userRepository.existsByUsername(username)) {
            throw new Exception("Username already exists");
        }

        User user = new User();
        user.setUsername(username);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setFullName(fullName);
        user.setRole(role);
        user.setDealerId(dealerId);
        user.setIsActive(true);
        
        return userRepository.save(user);
    }
    public User getUserByUsername(String username) throws Exception {
        Optional<User> userOptional = userRepository.findByUsername(username);
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found!");
        }
        
        return userOptional.get();
    }
    public void changePassword(Long userId, String oldPassword, String newPassword) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found!");
        }
        
        User user = userOptional.get();
        
                if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new Exception("Old password is incorrect");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
    public void deactivateUser(Long userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found!");
        }
        
        User user = userOptional.get();
        user.setIsActive(false);
        userRepository.save(user);
    }
    public void activateUser(Long userId) throws Exception {
        Optional<User> userOptional = userRepository.findById(userId);
        
        if (userOptional.isEmpty()) {
            throw new Exception("User not found!");
        }
        
        User user = userOptional.get();
        user.setIsActive(true);
        userRepository.save(user);
    }
}
