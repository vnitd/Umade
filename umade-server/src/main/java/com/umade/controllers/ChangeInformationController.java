package com.umade.controllers;

import com.umade.Configuration;
import com.umade.models.User;
import com.umade.models.dto.StatusDto;
import com.umade.utils.database.UsersDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
@WebServlet(name = "ChangeInformationController", urlPatterns = {"/api/updateUserInfo"})
public class ChangeInformationController extends HttpServlet {
    private static final UsersDAO dbContext = Configuration.users;

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();

        int id = Integer.parseInt(req.getParameter("id"));
        String name = req.getParameter("name");
        String email = req.getParameter("email");
        String phone = req.getParameter("phone");
        String password = req.getParameter("password");
        String role = req.getParameter("role");
        String gender = req.getParameter("gender");
        String address = req.getParameter("address");
        String defectType = req.getParameter("defectType");
        int status = Integer.parseInt(req.getParameter("status"));

        if(dbContext.isExistEmail(id, email)){
            out.print(new StatusDto(1, "Email đã tồn tại."));
        }else if(dbContext.isExistPhone(id, phone)){
            out.print(new StatusDto(1, "Số điện thoại đã tồn tại."));
        }else{
            User user = new User(id, name, email, phone, password, role, gender, address, defectType, status);
            dbContext.changeInformation(id, user);
            out.print(new StatusDto(0, "Cập nhật thông tin thành công."));
        }
    }
}
