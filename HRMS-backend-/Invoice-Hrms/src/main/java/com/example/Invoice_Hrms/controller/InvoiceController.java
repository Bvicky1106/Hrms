package com.example.Invoice_Hrms.controller;

import com.example.Invoice_Hrms.dto.InvoiceDto;
import com.example.Invoice_Hrms.model.Invoice;
import com.example.Invoice_Hrms.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<Invoice> createInvoice(@RequestBody InvoiceDto data) {
        return ResponseEntity.ok(invoiceService.createInvoice(data));
    }

    @GetMapping
    public List<Invoice> getAllInvoices() {
        return invoiceService.getAllInvoices();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invoice> getInvoice(@PathVariable String id) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        return invoice != null ? ResponseEntity.ok(invoice) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Invoice> updateInvoice(@PathVariable String id, @RequestBody InvoiceDto data) {
        Invoice updatedInvoice = invoiceService.updateInvoice(id, data);
        return updatedInvoice != null ? ResponseEntity.ok(updatedInvoice) : ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/with-amounts")
    public ResponseEntity<InvoiceDto> getInvoiceWithAmounts(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getInvoiceWithAmounts(id));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Invoice> updateInvoiceStatus(@PathVariable String id, @RequestParam String status) {
        Invoice invoice = invoiceService.getInvoiceById(id);
        if (invoice == null) {
            return ResponseEntity.notFound().build();
        }

        invoice.setInvoiceStatus(status);
        return ResponseEntity.ok(invoiceService.save(invoice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvoice(@PathVariable String id) {
        boolean deleted = invoiceService.deleteInvoice(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> deleteInvoiceItem(@PathVariable String itemId) {
        boolean deleted = invoiceService.deleteItemById(itemId);
        if (deleted) {
            return ResponseEntity.ok("Item deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/preview-invoice-no")
    public ResponseEntity<?> getPreviewInvoiceNumber() {
        try {
            String invoiceNumber = invoiceService.generateInvoiceNumber();
            return ResponseEntity.ok(invoiceNumber);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating invoice number: " + e.getMessage());
        }
    }
    @PatchMapping("/{id}/is-delete")
    public ResponseEntity<Invoice> updateIsDelete(@PathVariable String id, @RequestParam String isDelete) {
        Invoice updatedInvoice = invoiceService.updateIsDelete(id, isDelete);
        return updatedInvoice != null ? ResponseEntity.ok(updatedInvoice) : ResponseEntity.notFound().build();
    }
}