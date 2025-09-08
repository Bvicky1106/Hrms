package com.example.Invoice_Hrms.repository;

import com.example.Invoice_Hrms.model.Item;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ItemRepository  extends MongoRepository<Item, String> {


         List<Item> findByInvoiceId(String invoiceId);


}
