package com.acleda.company.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
        System.out.println("Third Party API processing");
        String username = "admin";
        String password = "093425121";
        String encodedUsername = new String(Base64.getEncoder().encode(username.getBytes()));
        String encodedPassword = new String(Base64.getEncoder().encode(password.getBytes()));
        System.out.println(encodedUsername);
        System.out.println(encodedPassword);

        String descodeUsername = new String(Base64.getDecoder().decode(encodedUsername.getBytes()));
        String dencodedPassword = new String(Base64.getDecoder().decode(encodedPassword.getBytes()));
        System.out.println(descodeUsername);
        System.out.println(dencodedPassword);
        String url = "http://localhost:20033/api/users?username=" + encodedUsername + "&password=" + encodedPassword;
        System.out.println(url);
    }

}
