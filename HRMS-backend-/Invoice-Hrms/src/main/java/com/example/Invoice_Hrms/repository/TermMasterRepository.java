package com.example.Invoice_Hrms.repository;

import com.example.Invoice_Hrms.model.TermMaster;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TermMasterRepository extends MongoRepository<TermMaster, String> {
}
