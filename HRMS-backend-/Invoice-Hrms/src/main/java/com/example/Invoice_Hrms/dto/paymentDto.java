package com.example.Invoice_Hrms.dto;


import lombok.Data;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;

@Data
public class paymentDto {


    private String id;
    private  String invoiceNo;
    private  double paymentAmount;
    private LocalDate paymentDate;
    private  String paymentMethod;
    private  String referenceNo;

}
