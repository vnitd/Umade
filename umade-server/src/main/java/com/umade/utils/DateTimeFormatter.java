/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.utils;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author vnitd
 */
public class DateTimeFormatter {

    public static String format(Timestamp time) {
        return new SimpleDateFormat("hh:mm:ss - 'ngày' dd 'tháng' MM 'năm' yyyy").format(new Date(time.getTime()));
    }
}
