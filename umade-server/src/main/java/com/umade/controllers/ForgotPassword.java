/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.controllers;

import com.umade.Configuration;
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
                    .sendTemplate(new URL("https://localhost:8080/templates/gmail_code.jsp"));
        } catch (MalformedURLException ex) {
            Logger.getLogger(ForgotPassword.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    //Change ~ DoPost
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cmd = req.getParameter("cmd");
        String receiveEmail = req.getParameter("receiveEmail");
        HttpSession mySession = req.getSession();
        System.out.println(receiveEmail);
        System.out.println(dbContext.isExist(receiveEmail));
        if (cmd.equals("1")) {
            if (receiveEmail != null && dbContext.isExist(receiveEmail)) {
                String otpvalue = RandomGenerator.randString(RandomGenerator.NUMERIC_CHARACTER, 6);
                
                sendVerificationMail(receiveEmail, "Email xác nhận Khôi phục mật khẩu", 0, otpvalue);
                
                mySession.setAttribute(receiveEmail, otpvalue);
                resp.getWriter().print(new StatusDto(0, "Gửi mã OTP thành công"));
            } else {
                resp.getWriter().print(new StatusDto(1, "Gửi mã OTP thất bại"));
            }
        }
    }
    
}
