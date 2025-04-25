package com.acleda.company.api.exceptions;

public class ParameterException extends RuntimeException {
    public ParameterException(String message) {
        super(message);
    }
    public ParameterException(String message, Throwable cause) {
        super(message, cause);
    }
}