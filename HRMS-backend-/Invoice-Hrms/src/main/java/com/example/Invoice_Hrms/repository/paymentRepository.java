package com.example.Invoice_Hrms.repository;

import com.example.Invoice_Hrms.model.payment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface paymentRepository  extends MongoRepository<payment,String> {


    List<payment> findByInvoiceNo(String invoiceNo);

}
