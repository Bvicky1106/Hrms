package com.example.Invoice_Hrms.dto;

    import java.math.BigDecimal;
    import java.time.LocalDate;
import java.util.List;

import lombok.Data;
    import lombok.NonNull;
    import org.springframework.data.annotation.Id;


@Data

    public class InvoiceDto {

    @Id
         private  String id;
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
        private String InvoiceStatus;

        private BigDecimal totalAmount;
        private BigDecimal paidAmount;
        private BigDecimal pendingAmount;

        private String companyName;
        private String companyAddress;
        private String companyMobileNo;
        private String companyEmail;
        private String ThanksNote;
        private String is_delete;

        private List<itemDto> items;

    private List<paymentDto> payments;
    }


