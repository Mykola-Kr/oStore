package com.krainyk.ostore.service;

import com.krainyk.ostore.entity.User;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User findOne(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new NoMatchesException("User with id " + id + " does not exist"));
    }

}
