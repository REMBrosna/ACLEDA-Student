package com.acleda.company.api.helper;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Component
@Log4j2
public class ApiRestHelper {


    public ResponseEntity<String> post(String url, HttpEntity<?> entityRequest) {
        log.info("RestTemplate - post");
        try {
            RestTemplate restTemplate = new RestTemplate();
            return restTemplate.exchange(url, HttpMethod.POST, entityRequest, String.class);
        } catch (HttpClientErrorException e) {
            log.error("post : {}", e.getResponseBodyAsString());
            return new ResponseEntity<>(e.getResponseBodyAsString(), e.getStatusCode());
        }
    }
    public ResponseEntity<String> get(String url, HttpEntity<String> entityRequest) {
        log.info("RestTemplate - get");
        ResponseEntity<String> response;
        try {
            RestTemplate restTemplate = new RestTemplate();
            response = restTemplate.exchange(url, HttpMethod.GET, entityRequest, String.class);
        } catch (HttpClientErrorException e) {
            log.error("get : {}" , e.getResponseBodyAsString());
            return new ResponseEntity<>(e.getResponseBodyAsString(), e.getStatusCode());
        }
        return response;
    }
}
