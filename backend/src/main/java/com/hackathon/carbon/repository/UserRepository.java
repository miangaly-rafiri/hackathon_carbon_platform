package com.hackathon.carbon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.hackathon.carbon.model.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
