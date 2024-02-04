/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/JSP_Servlet/Servlet.java to edit this template
 */
package com.umade.controllers;

import com.umade.Configuration;
import com.umade.models.dto.StatusDto;
import com.umade.utils.database.VouchersDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.List;

/**
 *
 * @author vnitd
 */
@WebServlet(name = "VouchersController", urlPatterns = {"/api/vouchers"})
public class VouchersController extends HttpServlet {

    public static final VouchersDAO dbContext = Configuration.vouchers;

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();
        if (req.getParameter("id") == null) {
            out.println(dbContext.getAll());
        } else {
            out.println(
                    dbContext.get(
                            (voucher) -> voucher.getId() == Integer.parseInt(req.getParameter("id"))
                    )
            );
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();

        try {
            String name = req.getParameter("name");
            double sales = Double.parseDouble(req.getParameter("sales"));

            dbContext.add(name, sales);
            out.println(new StatusDto(0, null));
        } catch (NumberFormatException ex) {
            out.println(new StatusDto(1, null));
            throw ex;
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        PrintWriter out = resp.getWriter();

        String id = req.getParameter("id");
        if (id != null) {
            dbContext.delete(Integer.parseInt(id));
            out.println(new StatusDto(0, null));
            System.out.println(new StatusDto(0, null));
        } else {
            out.println(new StatusDto(1, null));
        }
    }

}
