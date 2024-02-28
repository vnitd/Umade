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

/**
 *
 * @author hoang hung
 */
@WebServlet(name = "SignUpController", urlPatterns = "/api/signUp")
public class SignUpController extends HttpServlet {
    private static final UsersDAO dbContext = Configuration.users;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
    
    

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();
        
        String username = req.getParameter("name");
        String email = req.getParameter("email");
        String phone = req.getParameter("phone");
        String password = req.getParameter("password");
        String gender = req.getParameter("gender");
        String defectType = req.getParameter("defectType");
        String address = req.getParameter("address");
                
        if (dbContext.isExist(email)) {
            out.print(new StatusDto(1, "Email đã được đăng ký"));
        } else {
            dbContext.add(username, email, phone, password, gender, defectType, address);
            out.print(new StatusDto(0, null));
        }
    }
}
