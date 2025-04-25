package com.acleda.company.api.converter;


import lombok.extern.log4j.Log4j2;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

@Log4j2
public class JsonConverter {
    public static JSONObject jsonToObject(String json) {
        try {
            return new JSONObject(json);
        } catch (JSONException e) {
            log.error("Invalid JSON format", e);
            return new JSONObject().put("error", "Invalid JSON");
        }
    }
    public static boolean isJSONValid(String string) {
        try {
            new JSONObject(string);
        } catch (JSONException ex) {
            try {
                new JSONArray(string);
            } catch (JSONException ex1) {
                return false;
            }
        }
        return true;
    }
}
