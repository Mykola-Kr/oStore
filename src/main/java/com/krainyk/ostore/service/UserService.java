package com.krainyk.ostore.service;

import com.krainyk.ostore.dto.request.UserRequest;
import com.krainyk.ostore.dto.respond.AuthenticationResponse;
import com.krainyk.ostore.entity.User;
import com.krainyk.ostore.entity.UserRole;
import com.krainyk.ostore.exceptions.NoMatchesException;
import com.krainyk.ostore.repository.UserRepository;
import com.krainyk.ostore.security.JwtTokenTool;
import com.krainyk.ostore.security.JwtUser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenTool jwtTokenTool;
    @Autowired
    private BCryptPasswordEncoder encoder;

    public User findOne(Long id) {
        return userRepository.findById(id).orElseThrow(() ->
                new NoMatchesException("User with id " + id + " does not exist"));
    }

    public AuthenticationResponse register(UserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadCredentialsException("User with username " + request.getUsername() + " already exists");
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setUserRole(UserRole.ROLE_USER);
        user.setPassword(encoder.encode(request.getPassword()));

        userRepository.save(user);

        return login(request);
    }

    public AuthenticationResponse login(UserRequest request) {
        String username = request.getUsername();
        User user = findByUsername(username);
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, request.getPassword()));
        String token = jwtTokenTool.createToken(username, user.getUserRole());
        return new AuthenticationResponse(username, token);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = findByUsername(username);
        return new JwtUser(user.getUsername(), user.getUserRole(), user.getPassword());
    }

    private User findByUsername(String username)  {
        return userRepository.findByUsername(username).orElseThrow(() ->
                new UsernameNotFoundException("User with username " + username + " not exists"));
    }
}
