package com.example.Invoice_Hrms.controller;

import com.example.Invoice_Hrms.service.InvoiceEmailService;


import com.example.Invoice_Hrms.util.PdfGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;



@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/mail")
@RequiredArgsConstructor
public class mailController {


    private final InvoiceEmailService invoiceEmailService;
    @PostMapping("/send-email")
    public ResponseEntity<String> sendEmai1l(
            @RequestParam("invoiceNo") String invoiceNo,
            @RequestParam("pdf") MultipartFile pdf) {

        try {
            byte[] pdfBytes = pdf.getBytes();
            String recipientEmail = invoiceEmailService.getEmailByInvoiceNo(invoiceNo);
            if (recipientEmail == null || recipientEmail.isEmpty()) {
                return ResponseEntity.badRequest().body("No email found for invoiceNo: " + invoiceNo);
            }

            invoiceEmailService.sendInvoiceWithAttachment(invoiceNo, pdfBytes, recipientEmail);

            return ResponseEntity.ok("Email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Email sending failed.");
        }
    }
    @PostMapping("/send-email1")
    public ResponseEntity<String> sendEmail(
            @RequestParam String invoiceNo,
            @RequestParam("file") MultipartFile pdf) {
        try {
            byte[] pdfBytes = pdf.getBytes();


            String recipientEmail = invoiceEmailService.getEmailByInvoiceNo(invoiceNo);
            if (recipientEmail == null || recipientEmail.isEmpty()) {
                return ResponseEntity.badRequest().body("No email found for invoiceNo: " + invoiceNo);
            }

            invoiceEmailService.sendInvoiceWithAttachment(invoiceNo, pdfBytes, recipientEmail);

            return ResponseEntity.ok("Email sent successfully to " + recipientEmail);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }



}

