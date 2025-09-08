package com.example.Invoice_Hrms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "invoices")
public class Invoice {
    @Id
    private String id;
    private String invoiceNo;
    private LocalDate invoiceDate;
    private String invoiceTerms;
    private LocalDate dueDate;
    private String invoiceCompanyName;
    private String invoiceCompanyAddress;
    private String invoiceCountry;
    private String invoicePinCode;
    private String invoiceEmail;
    private String invoiceMobileNo;
    private String invoiceConsultantName;
    private String invoiceCurrency;
    private String invoiceStatus;
    private String companyName;
    private String companyAddress;
    private String companyMobileNo;
    private String companyEmail;
    private String thanksNote;
    private List<Item> items;
    private String is_delete;
}