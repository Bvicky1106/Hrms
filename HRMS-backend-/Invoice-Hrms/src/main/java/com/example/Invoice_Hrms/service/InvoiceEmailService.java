package com.example.Invoice_Hrms.service;



import com.example.Invoice_Hrms.model.Invoice;
import com.example.Invoice_Hrms.repository.InvoiceRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class InvoiceEmailService {

    private static final Logger logger = LoggerFactory.getLogger(InvoiceEmailService.class);
    private final JavaMailSender mailSender;
    private  final InvoiceRepository invoiceRepository;

    public String getEmailByInvoiceNo(String invoiceNo) {
        // Example with JPA repository
        Optional<Invoice> invoiceOpt = Optional.ofNullable(invoiceRepository.findByInvoiceNo(invoiceNo));
        return invoiceOpt.map(Invoice::getInvoiceEmail).orElse(null);
    }



    public void sendInvoiceWithAttachment(String invoiceNo, byte[] pdfData, String recipientEmail) throws MessagingException {
        logger.info("Sending invoice email for invoiceNo: {}", invoiceNo);

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(recipientEmail);
        helper.setSubject("Invoice " + invoiceNo);
        helper.setText("Please find attached your invoice: " + invoiceNo, false);


        helper.addAttachment("invoice-" + invoiceNo + ".pdf", new ByteArrayResource(pdfData));

        mailSender.send(message);

        logger.info("Invoice email sent successfully for invoiceNo: {}", invoiceNo);
    }

}
