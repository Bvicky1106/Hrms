package com.example.Invoice_Hrms.mapper;

import com.example.Invoice_Hrms.dto.paymentDto;
import com.example.Invoice_Hrms.model.payment;
import org.springframework.stereotype.Component;

@Component
public class paymentMapper {


    public payment toEntity(paymentDto dto){

         payment payment = new payment();
         payment.setId(dto.getId());
         payment.setInvoiceNo(dto.getInvoiceNo());
         payment.setPaymentAmount(dto.getPaymentAmount());
         payment.setPaymentDate(dto.getPaymentDate());
         payment.setPaymentMethod(dto.getPaymentMethod());
         payment.setReferanceNo(dto.getReferenceNo());
         return payment;

    }

    public  paymentDto toDto(payment payment){
        paymentDto dto  = new paymentDto();
        dto.setId(payment.getId());
        dto.setInvoiceNo(payment.getInvoiceNo());
        dto.setPaymentAmount(payment.getPaymentAmount());
        dto.setPaymentDate(payment.getPaymentDate());
        dto.setPaymentMethod(payment.getPaymentMethod());
        dto.setReferenceNo(payment.getReferanceNo());
        return  dto;
    }
}
