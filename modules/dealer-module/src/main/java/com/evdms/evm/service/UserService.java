package com.evdms.evm.service;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.evdms.evm.model.User;
import com.evdms.evm.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // GET all
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET by ID
    @SuppressWarnings("null")
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    // POST
    @SuppressWarnings("null")
    public User saveUser(User user) {
        return userRepository.save(user);
    }

    // PUT
    public User updateUser(Long id, User updatedUser) {
        User existing = getUserById(id);
        existing.setUsername(updatedUser.getUsername());
        existing.setPasswordHash(updatedUser.getPasswordHash());
        existing.setFullName(updatedUser.getFullName());
        existing.setRole(updatedUser.getRole());
        existing.setDealerId(updatedUser.getDealerId());
        existing.setIsActive(updatedUser.getIsActive());
        return userRepository.save(existing);
    }

    // DELETE
    @SuppressWarnings("null")
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        userRepository.deleteById(id);
    }
}
