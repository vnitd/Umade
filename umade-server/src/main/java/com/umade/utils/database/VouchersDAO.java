/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.utils.database;

import com.umade.models.Voucher;
import com.umade.utils.DateTimeFormatter;
import com.umade.utils.SQLDatabase;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author vnitd
 */
public class VouchersDAO extends SQLDatabase {

    private String table;

    public VouchersDAO(Connection connection) {
        super(connection);
    }

    public List<Voucher> getAll() {
        List<Voucher> res = new ArrayList<>();
        try {
            ResultSet rs = executeQueryPreparedStatement("SELECT * FROM " + table);
            while (rs.next()) {
                res.add(
                        new Voucher(
                                rs.getInt("id"),
                                rs.getNString("name"),
                                rs.getInt("sales") / 100.0,
                                DateTimeFormatter.format(rs.getTimestamp("createdDate")),
                                rs.getTimestamp("deletedDate")
                        )
                );
            }
        } catch (SQLException ex) {
            Logger.getLogger(VouchersDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return res;
    }

    public List<Voucher> get(Predicate<Voucher> function) {
        List<Voucher> res = new ArrayList<>();
        try {
            ResultSet rs = executeQueryPreparedStatement("SELECT * FROM " + table);
            while (rs.next()) {
                Voucher v = new Voucher(
                        rs.getInt("id"),
                        rs.getNString("name"),
                        rs.getInt("sales") / 100.0,
                        DateTimeFormatter.format(rs.getTimestamp("createdDate")),
                        rs.getTimestamp("deletedDate")
                );
                if (function.test(v)) {
                    res.add(v);
                }
            }
        } catch (SQLException ex) {
            Logger.getLogger(VouchersDAO.class.getName()).log(Level.SEVERE, null, ex);
        }
        return res;
    }

    public void add(String name, double sales) {
        executePreparedStatement("INSERT INTO " + table
                + "(name, sales) VALUES (?, ?)", name, (int) (sales * 100));
    }

    public void delete(int id) {
        System.out.println(id);
        executePreparedStatement("DELETE FROM " + table + " WHERE id=?", id);
    }
}
