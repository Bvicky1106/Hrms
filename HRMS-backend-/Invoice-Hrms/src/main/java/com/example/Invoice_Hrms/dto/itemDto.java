package com.example.Invoice_Hrms.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

import java.math.BigDecimal;

@Data

public class itemDto {

  @Id
    private  String id;
    private String itemName;
    private String description;
    private BigDecimal qty;
    private BigDecimal rate;
    private BigDecimal amount;
    private  String invoiceId;

}
