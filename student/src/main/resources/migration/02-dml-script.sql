/*22/04/2025 Brosna REM - Create Database*/

ALTER TABLE t_std_user ADD CONSTRAINT unique_email UNIQUE (email);
/*-- INSERT ROLES FOR USER */
INSERT INTO t_app_role (`id`, `description`, `name`) VALUES (1, 'ROLE_ADMIN', 'ROLE_ADMIN');
INSERT INTO t_app_role (`id`, `description`, `name`) VALUES (2, 'ROLE_STUDENT', 'ROLE_STUDENT');

/*-- INSERT TEMPLATE FOR NOTIFICATION */
INSERT INTO `student`.`t_notification_template` (`not_id`, `not_channel_type`, `not_content`, `not_content_type`, `not_desc`, `not_rec_status`, `not_subject`) VALUES (1, 'EMAIL', '<html>\r\n   <head>\r\n      <meta http-equiv=Content-Type content=\"text/html; charset=windows-1252\">\r\n      <meta name=Generator content=\"Microsoft Word 15 (filtered)\">\r\n   </head>\r\n   <body lang=EN-SG link=\"#0563C1\" vlink=\"#954F72\">\r\n      <div class=WordSection1>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">Dear :username, </span></p>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">&nbsp;</span></p>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">Your new password :password &nbsp; </span></p>\r\n&nbsp;</span></p>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">Thanks and Best Regards, </span></p>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">&nbsp;</span></p>\r\n         <p class=MsoNormal><span style=\"font-family:\"Arial\",sans-serif\">Student Management Support Team</span></p>\r\n      </div>\r\n   </body>\r\n</html>', 'HTML', 'Student Management', 'A', 'reset password');
