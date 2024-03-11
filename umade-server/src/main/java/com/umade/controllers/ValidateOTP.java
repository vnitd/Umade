package com.umade.controllers;

import com.umade.models.dto.StatusDto;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;

/**
 *
 * @author MyDuyen
 */
@WebServlet(name = "validateOTP", urlPatterns = {"/api/validateOTP"})
public class ValidateOTP extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        int value = Integer.parseInt(req.getParameter("otp"));
        HttpSession session = req.getSession();
        int otp = (int) session.getAttribute("otp");
        if (value == otp) {
            resp.getWriter().print(new StatusDto(0, null));
        } else {
            resp.getWriter().print(new StatusDto(1, null));
        }
    }
}
