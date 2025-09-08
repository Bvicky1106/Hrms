package com.example.Invoice_Hrms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "payments")
public class payment {




    @Id
    private String id;
    private  String invoiceNo;
    private  double paymentAmount;
    private LocalDate paymentDate;
    private  String paymentMethod;
    private  String referanceNo;

}
