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

/**
 *
 * @author MyDuyen
 */
@WebServlet(name = "newPassword", urlPatterns = {"/api/newPassword"})
public class NewPassword extends HttpServlet {

    private static final UsersDAO dbContext = Configuration.users;

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        String newPassword = req.getParameter("newPassword");
        String renewPassword = req.getParameter("renewPassword");
        String email = (String) session.getAttribute("email");
        if (newPassword != null && renewPassword != null && newPassword.equals(renewPassword)) {
            try {
                dbContext.changePassword(email, newPassword);
                int affectRow = dbContext.changePassword(email, newPassword);
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
