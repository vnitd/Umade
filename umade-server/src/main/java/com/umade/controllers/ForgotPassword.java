/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.controllers;

import com.umade.Configuration;
import com.umade.models.User;
import com.umade.models.dto.StatusDto;
import com.umade.utils.DateFormatting;
import com.umade.utils.Gmail;
import com.umade.utils.RandomGenerator;
import com.umade.utils.database.UsersDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author MyDuyen
 */
@WebServlet(name = "ForgotPasswordController", urlPatterns = {"/api/forgotPassword"})

public class ForgotPassword extends HttpServlet {

    private final UsersDAO dbContext = Configuration.users;

    private void sendVerificationMail(String email, String subject, int id, String code) {
        try {
            new Gmail(email)
                    .setContentType("text/html; charset=UTF-8")
                    .setSubject(subject)
                    .initMacro()
                    .appendMacro("EMAIL", email)
                    .appendMacro("ID", id + "")
                    .appendMacro("WHEN", DateFormatting.format(new Date()))
                    .appendMacro("CODE", code)
                    .sendTemplate(new URL("http://localhost:8080/templates/gmail_code.jsp"));
        } catch (MalformedURLException ex) {
            Logger.getLogger(ForgotPassword.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    //Change ~ DoPost
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cmd = req.getParameter("cmd");
        HttpSession mySession = req.getSession();
        if (cmd.equals("1")) {
            String receiveEmail = req.getParameter("receiveEmail");
            if (receiveEmail != null && dbContext.isExist(receiveEmail)) {
                String otpvalue = RandomGenerator.randString(RandomGenerator.NUMERIC_CHARACTER, 6);
                User user = dbContext.getUserFromEmail(receiveEmail);

                new Thread(() -> {
                    sendVerificationMail(receiveEmail, "Verification code", user.getId(), otpvalue);
                }).start();

                mySession.setAttribute(receiveEmail, otpvalue);
                resp.getWriter().print(new StatusDto(0, "Gửi mã OTP thành công"));
            } else {
                resp.getWriter().print(new StatusDto(1, "Gửi mã OTP thất bại"));
            }
        } else if (cmd.equals("2")) {
            String email = req.getParameter("email");
            String otp = req.getParameter("code");
            String code = (String) mySession.getAttribute(email);

            if (otp.equals(code)) {
                resp.getWriter().print(new StatusDto(0, "Mã xác nhận chính xác!"));
            } else {
                resp.getWriter().print(new StatusDto(1, "Sai mã xác nhận!"));
            }
        } else if (cmd.equals("3")) {
            String email = req.getParameter("email");
            String password = req.getParameter("password");
            try {
                int affectRow = dbContext.changePassword(email, password);
                if (affectRow > 0) {
                    resp.getWriter().print(new StatusDto(0, "Đổi mật khẩu thành công"));
                } else {
                    resp.getWriter().print(new StatusDto(1, "Phiên làm việc đã hết hạn"));
                }
            } catch (IOException e) {
                resp.getWriter().print(new StatusDto(1, "Thất bại"));

            }
        }
    }

}
