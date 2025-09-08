package com.example.Invoice_Hrms.controller;

import com.example.Invoice_Hrms.dto.CompanyDto;
import com.example.Invoice_Hrms.service.CompanyService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/companies")
public class CompanyController {

    private final CompanyService service;

    public CompanyController(CompanyService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<CompanyDto> createCompany(@RequestBody CompanyDto dto) {
        return new ResponseEntity<>(service.createCompany(dto), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        return ResponseEntity.ok(service.getAllCompanies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CompanyDto> getCompanyById(@PathVariable String id) {
        return ResponseEntity.ok(service.getCompanyById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CompanyDto> updateCompany(@PathVariable String id, @RequestBody CompanyDto dto) {
        return ResponseEntity.ok(service.updateCompany(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCompany(@PathVariable String id) {
        service.deleteCompany(id);
        return ResponseEntity.noContent().build();
    }
}