package com.acleda.company.student.event;

import com.acleda.company.student.administrator.model.TAppUser;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.ApplicationEvent;


@Setter
@Getter
public class AppUserEvent extends ApplicationEvent {
    private TAppUser tAppUser;
    private String newPassword; // 👈 Add this
    private String registerPwd;
    private String temType;

    public AppUserEvent(Object source) {
        super(source);
    }

}
