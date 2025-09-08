package com.example.Invoice_Hrms.mapper;

import com.example.Invoice_Hrms.dto.InvoiceDto;
import com.example.Invoice_Hrms.model.Invoice;

public class InvoiceMapper {



    public static InvoiceDto toDto(Invoice invoice) {

    InvoiceDto dto = new InvoiceDto();

        dto.setId(invoice.getId());
        dto.setInvoiceNo(invoice.getInvoiceNo());
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setInvoiceTerms(invoice.getInvoiceTerms());
        dto.setDueDate(invoice.getDueDate());

        dto.setInvoiceCompanyName(invoice.getInvoiceCompanyName());
        dto.setInvoiceCompanyAddress(invoice.getInvoiceCompanyAddress());
        dto.setInvoiceCountry(invoice.getInvoiceCountry());
        dto.setInvoicePinCode(invoice.getInvoicePinCode());
        dto.setInvoiceEmail(invoice.getInvoiceEmail());
        dto.setInvoiceMobileNo(invoice.getInvoiceMobileNo());
        dto.setInvoiceConsultantName(invoice.getInvoiceConsultantName());
        dto.setInvoiceCurrency(invoice.getInvoiceCurrency());
        dto.setInvoiceStatus(invoice.getInvoiceStatus());

        dto.setCompanyName(invoice.getCompanyName());
        dto.setCompanyAddress(invoice.getCompanyAddress());
        dto.setCompanyMobileNo(invoice.getCompanyMobileNo());
        dto.setCompanyEmail(invoice.getCompanyEmail());
        dto.setThanksNote(invoice.getThanksNote());

        return dto;
}
}
