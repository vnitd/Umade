/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.controllers;

import com.umade.Configuration;
import com.umade.models.dto.StatusDto;
import com.umade.utils.database.UsersDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.util.Properties;
import java.util.Random;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import jakarta.mail.Message;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import java.util.Date;

/**
 *
 * @author MyDuyen
 */
@WebServlet(name = "ForgotPasswordController", urlPatterns = {"/api/forgotPassword"})

public class ForgotPassword extends HttpServlet {

    private final String sendEmail = "umade2024@gmail.com";
    private final String appPass = "gsea rnrv madg atqh";
    private final UsersDAO dbContext = Configuration.users;

    //Change ~ DoPost
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String receiveEmail = req.getParameter("receiveEmail");
        int otpvalue = 0;
        HttpSession mySession = req.getSession();
        System.out.println(receiveEmail);
        System.out.println(dbContext.isExist(receiveEmail));
        if (receiveEmail != null && dbContext.isExist(receiveEmail)) {
            Random rand = new Random();
            otpvalue = rand.nextInt(12345678);
            String to = receiveEmail;

            Properties props = new Properties();
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.port", "587");
            props.put("mail.smtp.starttls.enable", "true");

            Session session = Session.getDefaultInstance(props, new jakarta.mail.Authenticator() {

                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(sendEmail, appPass);// Put your email																				// password here
                }
            });

            try {
                MimeMessage message = new MimeMessage(session);
                message.setFrom(new InternetAddress(receiveEmail));
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
                message.setSubject("UMADE - OTP to reset new password");
                message.setSentDate(new Date());
                message.setText("To reset your password, please enter this code to confirm. Your OTP is: " + otpvalue);
                // send message
                Transport.send(message);
                System.out.println("message sent successfully");
            } catch (MessagingException e) {
                throw new RuntimeException(e);
            }
            req.setAttribute("message", "OTP is sent to your email id");
            mySession.setAttribute("otp", otpvalue);
            mySession.setAttribute("email", receiveEmail);
            resp.getWriter().print(new StatusDto(0, "Gửi mã OTP thành công"));
        } else {
            resp.getWriter().print(new StatusDto(1, "Gửi mã OTP thất bại"));
        }
    }

}
