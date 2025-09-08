package com.example.Invoice_Hrms.repository;import com.example.Invoice_Hrms.model.Invoice;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;public interface InvoiceRepository extends MongoRepository<Invoice, String> {
    Invoice findByInvoiceNo(String invoiceNo);
    boolean existsByInvoiceNo(String invoiceNo);
    void deleteByInvoiceNo(String invoiceNo);// Corrected to use aggregation for counting invoices with invoiceNo starting with a prefix
    @Aggregation(pipeline = {
            "{'$match': {'invoiceNo': { '$regex': '^?0', '$options': 'i' }}}",
            "{'$count': 'count'}"
    })
    Long countByInvoiceNoStartingWith(String prefix);}

