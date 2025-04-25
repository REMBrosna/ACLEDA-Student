package com.acleda.company.api.service;


import jakarta.servlet.http.HttpServletRequest;

public interface ApiExecutor {

    Object getUserList(HttpServletRequest request) throws Exception;
}
