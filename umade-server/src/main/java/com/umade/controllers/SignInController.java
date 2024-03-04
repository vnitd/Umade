
package com.umade.controllers;

import com.umade.Configuration;
import com.umade.utils.database.UsersDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "SignInController", urlPatterns = "/api/signIn")
public class SignInController extends HttpServlet{
    private static final UsersDAO dbContext = Configuration.users;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();
        
        String email = req.getParameter("email");
        String password = req.getParameter("password");
        
        if(!dbContext.isExist(email)){
            out.print("Email has not been registered in the system, Please enter again!");
            return;
        }
        
        if(!dbContext.checkPassword(email, password)){
            out.print("Password is incorrect");
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        super.doGet(req, resp);
    }
}
