package com.acleda.company.student.administrator.enums;

public enum NotificationTemplateName {

    RESET_PASSWORD("1"),
    FORGOT_PASSWORD("forgot_password"),
    REGISTER_PASSWORD("2");
    private String desc;

    NotificationTemplateName(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }
}
