package com.example.Invoice_Hrms.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class CompanyDto {


    @Id
    private String id;
    private  String companyName;
    private  String contactName;
    private  String companyAddress;
    private  String companyCountry;
    private  String companyPinCode;
    private  String companyEmail;
    private  String companyMobileNo;
    private  String LogoUrl;


}
