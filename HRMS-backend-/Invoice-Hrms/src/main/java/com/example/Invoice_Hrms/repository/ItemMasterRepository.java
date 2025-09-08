package com.example.Invoice_Hrms.repository;

import com.example.Invoice_Hrms.model.ItemMaster;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ItemMasterRepository extends MongoRepository<ItemMaster,String> {
}
