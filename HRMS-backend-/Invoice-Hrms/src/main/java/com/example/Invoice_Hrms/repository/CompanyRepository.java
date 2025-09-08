package com.example.Invoice_Hrms.repository;

import com.example.Invoice_Hrms.model.Company;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface CompanyRepository extends MongoRepository<Company,String> {


}
