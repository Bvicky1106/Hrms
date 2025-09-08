package com.example.Invoice_Hrms.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "terms")
public class TermMaster {
    @Id
    private String id;
    private String term;
    private String description;
}
