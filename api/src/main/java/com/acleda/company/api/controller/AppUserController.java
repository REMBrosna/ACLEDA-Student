package com.acleda.company.api.controller;

import com.acleda.company.api.exceptions.ParameterException;
import com.acleda.company.api.response.api.ApiResponse;
import com.acleda.company.api.service.ApiStudentService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.file.attribute.UserPrincipalNotFoundException;


@RequestMapping("api/")
@CrossOrigin
@RestController
@Log4j2
public class AppUserController {

    @Autowired
    private ApiStudentService service;

    @GetMapping("/users")
    public ResponseEntity<Object> getUserByName(HttpServletRequest request) {
        ApiResponse<Object> serviceStatus = new ApiResponse<>();
        try {
            Object dto = service.getUserList(request);
            serviceStatus.setCode(HttpStatus.OK.value());
            serviceStatus.setMessage(HttpStatus.OK.name());
            serviceStatus.setData(dto);
            return new ResponseEntity<>(serviceStatus, HttpStatus.OK);
        } catch (ParameterException ex) {
            log.error("Username or Password missing in request: {}", ex.getMessage(), ex);
            serviceStatus.setMessage("Invalid input: " + ex.getMessage());
            serviceStatus.setCode(HttpStatus.BAD_REQUEST.value());
            return new ResponseEntity<>(serviceStatus, HttpStatus.BAD_REQUEST);
        } catch (UserPrincipalNotFoundException ex) {
            log.error("Unauthorized request: {}", ex.getMessage(), ex);
            serviceStatus.setMessage("Invalid input: " + ex.getMessage());
            serviceStatus.setCode(HttpStatus.NOT_FOUND.value());
            return new ResponseEntity<>(serviceStatus, HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            log.error("getUserByName error", ex);
            serviceStatus.setMessage(ex.getMessage());
            serviceStatus.setCode(HttpStatus.INTERNAL_SERVER_ERROR.value());
            return new ResponseEntity<>(serviceStatus, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}