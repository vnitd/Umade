package com.umade.utils.database;

import com.umade.models.User;
import com.umade.utils.SQLDatabase;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author hoang hung
 */
public class UsersDAO extends SQLDatabase {

    private String table;

    public UsersDAO(Connection connection) {
        super(connection);
    }

    public boolean isExist(String email) {
        ResultSet rs = executeQueryPreparedStatement("SELECT * FROM users WHERE email=?", email);
        try {
            if (rs != null && rs.next()) {
                return true;
            }
        } catch (SQLException ex) {
            Logger.getLogger(SQLDatabase.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }
        return false;
    }

    public User getUserFromEmail(String email) {
        ResultSet rs = executeQueryPreparedStatement("SELECT * FROM users WHERE email=?", email);
        User res = null;
        try {
            if (rs.next()) {
                res = new User(
                        rs.getInt("id"),
                        rs.getNString("name"),
                        rs.getString("email"),
                        rs.getString("phone"),
                        null,
                        rs.getString("role"),
                        rs.getString("gender"),
                        rs.getNString("address"),
                        rs.getString("defectType"),
                        rs.getInt("status")
                );
            }
        } catch (SQLException ex) {
            Logger.getLogger(SQLDatabase.class.getName()).log(Level.SEVERE, null, ex);
        }
        return res;
    }

    public void add(String name, String email, String password, String phone, String gender, String defectType,
            String address) {
        // When a new user sign up, role will be 'guest' by default
        executePreparedStatement("INSERT INTO " + table
                + " (name, email, password, phone, gender, defectType, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, 'guest')",
                name, email, password, phone, gender, defectType, address);
    }

    public boolean passwordCheck(String email, String inputPassword) {
        ResultSet rs = executeQueryPreparedStatement("SELECT * FROM " + table + " WHERE email = ?", email);

        try {
            if (rs.next()) {
                String currentPassword = rs.getString("password");
                return inputPassword.equals(currentPassword);
            }
        } catch (SQLException ex) {
            Logger.getLogger(SQLDatabase.class.getName()).log(Level.SEVERE, null, ex);
        }

        return false;
    }

    public int changePassword(String email, String newPassword) {

        return executeUpdatePreparedStatement("UPDATE " + table + " SET password=? WHERE email=?", newPassword, email);
    }
}
