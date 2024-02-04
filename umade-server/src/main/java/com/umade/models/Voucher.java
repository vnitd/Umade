/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.umade.models;

import com.umade.Configuration;
import java.sql.Timestamp;

/**
 *
 * @author vnitd
 */
public class Voucher {

    private int id;
    private String name;
    private double sales;
    private String createdDate;
    private Timestamp deletedDate;

    public Voucher(int id, String name, double sales, String createdDate, Timestamp deletedDate) {
        this.id = id;
        this.name = name;
        this.sales = sales;
        this.createdDate = createdDate;
        this.deletedDate = deletedDate;
    }

    public Voucher() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getSales() {
        return sales;
    }

    public void setSales(double sales) {
        this.sales = sales;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public Timestamp getDeletedDate() {
        return deletedDate;
    }

    public void setDeletedDate(Timestamp deletedDate) {
        this.deletedDate = deletedDate;
    }

    @Override
    public String toString() {
        return Configuration.gson.toJson(this);
    }

}
