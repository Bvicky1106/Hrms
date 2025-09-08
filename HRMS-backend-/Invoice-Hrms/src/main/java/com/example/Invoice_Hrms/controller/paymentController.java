package com.example.Invoice_Hrms.controller;


import com.example.Invoice_Hrms.dto.paymentDto;
import com.example.Invoice_Hrms.service.paymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class paymentController {

    private  final paymentService paymentService;


    @PostMapping
    public ResponseEntity<paymentDto> create (@RequestBody paymentDto dto){
        return ResponseEntity.ok(paymentService.createPayment(dto));
    }


    @GetMapping
    public ResponseEntity<List<paymentDto>> getAll() {
        return ResponseEntity.ok(paymentService.getAllPayment());
    }

    @GetMapping("/{id}")
    public ResponseEntity<paymentDto> getById(@PathVariable String id) {
        paymentDto dto = paymentService.getPaymentById(id);
        return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
    }


    @PutMapping("/{id}")
    public ResponseEntity<paymentDto> update(@PathVariable String id, @RequestBody paymentDto dto) {
        paymentDto updated = paymentService.updatePayment(id, dto);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }

}
