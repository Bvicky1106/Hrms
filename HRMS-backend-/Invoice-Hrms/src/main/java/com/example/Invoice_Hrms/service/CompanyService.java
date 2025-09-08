package com.example.Invoice_Hrms.service;

import com.example.Invoice_Hrms.dto.CompanyDto;
import com.example.Invoice_Hrms.mapper.CompanyMapper;
import com.example.Invoice_Hrms.model.Company;
import com.example.Invoice_Hrms.repository.CompanyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {
    private final CompanyRepository repository;

    public CompanyService(CompanyRepository repository) {
        this.repository = repository;
    }

    public CompanyDto createCompany(CompanyDto dto) {
        Company company = CompanyMapper.toEntity(dto);
        Company saved = repository.save(company);
        return CompanyMapper.toDto(saved);
    }

    public List<CompanyDto> getAllCompanies() {
        return repository.findAll().stream()
                .map(CompanyMapper::toDto)
                .collect(Collectors.toList());
    }

    public CompanyDto getCompanyById(String id) {
        Company company = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        return CompanyMapper.toDto(company);
    }

    public CompanyDto updateCompany(String id, CompanyDto dto) {
        Company existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Company not found with id: " + id));
        Company updated = CompanyMapper.toEntity(dto);
        updated.setId(existing.getId());
        Company saved = repository.save(updated);
        return CompanyMapper.toDto(saved);
    }

    public void deleteCompany(String id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Company not found with id: " + id);
        }
        repository.deleteById(id);
    }
}