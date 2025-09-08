package com.example.Invoice_Hrms.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document (collection = "ItemMaster")
public class ItemMaster {


    @Id

    private String id;


    private String itemName;
    private String description;

}
