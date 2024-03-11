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
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "ChangePasswordController", urlPatterns = { "/api/changePassword" })
public class ChangePasswordController extends HttpServlet {
    private static final UsersDAO dbContext = Configuration.users;

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();

        String email = req.getParameter("email");
        String oldPassword = req.getParameter("oldPassword");
        String newPassword = req.getParameter("newPassword");
        if (dbContext.passwordCheck(email, oldPassword)) {
            out.print(new StatusDto(0, "Mật khẩu đã khớp"));
            dbContext.changePassword(email, newPassword);
        } else {
            out.print(new StatusDto(1, null));
        }
    }

}
