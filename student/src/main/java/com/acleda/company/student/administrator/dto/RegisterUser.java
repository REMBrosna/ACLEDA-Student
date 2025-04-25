package com.acleda.company.student.administrator.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegisterUser {

    private boolean admin;
    private String email;
    private String username;
    private String password;
    private String firstname;
    private String lastname;
    private String fullName;
    private String gender;
    private Date dtOfBirth;
    private String address;
    private String conNumber;
    private String status;
    private Date usrDtCreate;
    private String usrUidCreate;
    private Date usrDtLupd;
    private String usrUidLupd;

    @Override
    public String toString() {
        return "RegisterUser{" +
                "admin=" + admin +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", firstname='" + firstname + '\'' +
                ", lastname='" + lastname + '\'' +
                ", fullName='" + fullName + '\'' +
                ", gender='" + gender + '\'' +
                ", dtOfBirth=" + dtOfBirth +
                ", address='" + address + '\'' +
                ", conNumber='" + conNumber + '\'' +
                ", status='" + status + '\'' +
                ", usrDtCreate=" + usrDtCreate +
                ", usrUidCreate='" + usrUidCreate + '\'' +
                ", usrDtLupd=" + usrDtLupd +
                ", usrUidLupd='" + usrUidLupd + '\'' +
                '}';
    }
}
