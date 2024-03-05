package com.umade.utils.database;

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
public class UsersDAO extends SQLDatabase{
    private String table;
    
    public UsersDAO(Connection connection) {
        super(connection);
    }
    
    public boolean isExist(String email) {
        ResultSet rs = executeQueryPreparedStatement("SELECT * FROM users WHERE email=?", email);
        
        try {
            if (rs != null && rs.next()) 
                return true;
        } catch (SQLException ex) {
            Logger.getLogger(SQLDatabase.class.getName()).log(Level.SEVERE, null, ex);
            return false;
        }
        return false;
    }
    
    public void add(String name, String email, String password, String phone, String gender, String defectType, String address) {
        executePreparedStatement("INSERT INTO " + table +
                " (name, email, password, phone, gender, defectType, address, role) VALUES (?, ?, ?, ?, ?, ?, ?, 'guest')",     // When a new user sign up, role will be 'guest' by default
                name, email, password, phone, gender, defectType, address);
    }
}
