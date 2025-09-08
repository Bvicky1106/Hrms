package com.example.Invoice_Hrms.mapper;


import java.math.BigDecimal;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@Document(collection = "item")

public class Item {
    @Id
    private String id;
    private String itemName;
    private String description;
    private BigDecimal qty;
    private BigDecimal rate;
    private BigDecimal amount;
    private String invoiceId;



    public Item(String itemName,String description, BigDecimal qty, BigDecimal rate, BigDecimal amount) {
        this.itemName = itemName;
        this.description= description;
        this.qty = qty;
        this.rate = rate;
        this.amount = amount;
    }


}
