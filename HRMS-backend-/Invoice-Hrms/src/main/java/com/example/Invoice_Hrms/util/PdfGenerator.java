package com.example.Invoice_Hrms.util;

import com.example.Invoice_Hrms.model.Invoice;
import org.springframework.stereotype.Component;
import org.thymeleaf.TemplateEngine;

import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Component
public class PdfGenerator {


    private final TemplateEngine templateEngine;

    public PdfGenerator(TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    public byte[] generateInvoicePdf(Invoice invoice) throws IOException {
        Context context = new Context();
        context.setVariable("invoice", invoice);

        String html = templateEngine.process("invoice-template", context);
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        ITextRenderer renderer = new ITextRenderer();
        renderer.setDocumentFromString(html);
        renderer.layout();
        renderer.createPDF(outputStream);

        return outputStream.toByteArray();
    }
}
