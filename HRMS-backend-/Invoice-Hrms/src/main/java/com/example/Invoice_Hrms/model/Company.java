package com.example.Invoice_Hrms.model;


import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document (collection ="company")
public class Company {



    @Id
    private String id;
    private String companyName;
    private String contactName;
    private String companyAddress;
    private String companyCountry;
    private String companyPinCode;
    private String companyEmail;
    private String companyMobileNo;
    private String logoUrl;
}

