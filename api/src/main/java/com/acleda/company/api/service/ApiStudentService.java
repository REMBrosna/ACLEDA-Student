package com.acleda.company.api.service;

import com.acleda.company.api.dto.AuthRequest;
import com.acleda.company.api.exceptions.ParameterException;
import com.acleda.company.api.helper.ApiRestHelper;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.log4j.Log4j2;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.nio.file.attribute.UserPrincipalNotFoundException;
import java.util.Base64;

import static com.acleda.company.api.constant.ApiConstant.STUDENT_URL;

@Log4j2
@Service
public class ApiStudentService implements ApiExecutor {

    @Autowired
    private ApiRestHelper apiRestHelper;

    @Override
    public Object getUserList(HttpServletRequest request) throws Exception {
        try {

            // Log incoming request parameters
            String username = request.getParameter("username");
            String password = request.getParameter("password");

            if (username == null && password == null) {
                log.warn("Missing request parameters: username={}, password={}", username, password != null ? "*****" : null);
                throw new ParameterException("Request username or password is missing");
            }
            String decodedUsername = new String(Base64.getDecoder().decode(username.getBytes()));
            String decodedPassword = new String(Base64.getDecoder().decode(password.getBytes()));
            log.info("Received postAuth request with username: {}", username); // 🔍 Log input (avoid logging passwords!)

            // Prepare request DTO
            AuthRequest dto = new AuthRequest();
            dto.setUsername(decodedUsername);
            dto.setPassword(decodedPassword);

            // Step 1: Authenticate and get token
            log.info("Authenticating user: {}", username);
            ResponseEntity<String> authResponse = this.postAuth(dto);

            if (authResponse == null || !authResponse.getStatusCode().is2xxSuccessful()) {
                log.error("Authentication failed for user: {}. Status: {}", username, authResponse != null ? authResponse.getStatusCode() : "null response");
                throw new UserPrincipalNotFoundException("Authentication failed!");
            }

            JSONObject authJson = new JSONObject(authResponse.getBody());
            String accessToken = authJson.getString("accessToken");
            log.debug("Access token received successfully");

            // Step 2: Call student API with token
            HttpHeaders apiHeaders = new HttpHeaders();
            apiHeaders.setContentType(MediaType.APPLICATION_JSON);
            apiHeaders.setBearerAuth(accessToken);

            HttpEntity<String> apiRequest = new HttpEntity<>(apiHeaders);
            log.info("Calling STUDENT_URL with token");

            ResponseEntity<String> userApiResponse = apiRestHelper.get(STUDENT_URL, apiRequest);

            // Wrap response
            JSONObject userJson = new JSONObject(userApiResponse.getBody());

            log.info("User data fetched successfully for user: {}", username);
            log.info("Student list info : {}", userJson.toMap());
            return userJson.toMap();

        } catch (ParameterException e) {
            log.error("Invalid request parameters: {}", e.getMessage(), e);
            throw e;

        } catch (UserPrincipalNotFoundException e) {
            log.error("Authentication error: {}", e.getMessage(), e);
            throw e;

        } catch (Exception e) {
            log.error("Unexpected error in postAuth: {}", e.getMessage(), e);
            throw e;
        }
    }

    public ResponseEntity<String> postAuth(AuthRequest dto) {
        log.info("postAuth : {}", dto);
        try {
            // 🔐 Add basic auth header manually
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            headers.set("Authorization", "Basic ");

            // 🧾 Request Body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("username", dto.getUsername());
            body.add("password", dto.getPassword());
            body.add("grant_type", "password");

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            RestTemplate restTemplate = new RestTemplate();
            log.info("Access Token Response: {} ", dto);
            ResponseEntity<String> response = restTemplate.postForEntity("http://localhost:8080/oauth/token", request, String.class);

            log.info("Access Token Response: {} ", response.getBody());

//            objToken = restHelper.post(authURL, requestEntity); // ⬅️ POST with form data
            return response;
        } catch (Exception e) {
            log.error("Exception postAuth ", e);
            e.printStackTrace();
        }

        return null;
    }
}
