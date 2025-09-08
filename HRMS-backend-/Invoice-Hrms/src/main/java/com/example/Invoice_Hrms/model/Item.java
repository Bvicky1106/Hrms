package com.example.Invoice_Hrms.model;
import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document (collection = "items")

public class Item {

 @Id
    private  String id;
    private String itemName;
    private  String description;
    private BigDecimal qty;
    private BigDecimal rate;
    private BigDecimal amount;

    private  String invoiceId;
}
