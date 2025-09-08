package com.example.Invoice_Hrms.dto;

import lombok.Data;
import org.springframework.data.annotation.Id;

@Data
public class ItemMasterDto {

@Id
    private String id;
    private String itemName;
    private String description;
}

