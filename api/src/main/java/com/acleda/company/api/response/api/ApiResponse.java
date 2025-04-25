package com.acleda.company.api.response.api;

import lombok.Builder;
import lombok.Data;
import lombok.ToString;

@Data
@Builder
@ToString
public class ApiResponse<T> {

    public static final Integer OK = 200;
    public static final Integer NOT_FOUND = 404;
    public static final Integer BAD_REQUEST = 400;
    public static final Integer UNAUTHORIZED = 401;
    public static final Integer INTERNAL_SERVER_ERROR = 500;

    private Integer code;
    private String message;
    private T data;

    public ApiResponse() {
        this.code = OK;
        this.message = "OK";
    }

    public ApiResponse(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public ApiResponse(T data) {
        this.code = OK;
        this.message = "OK";
        this.data = data;
    }

    public ApiResponse(Integer code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    public ApiResponse(Integer code, T data) {
        this.code = code;
        this.data = data;
    }
}